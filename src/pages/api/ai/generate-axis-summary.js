import connectToDatabase from "../../../lib/mongodb";
import { getAxisPrompt, formatPrompt } from "../../../lib/ai-prompts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { axisName, answers, userId, userEmail, axisData } = req.body;

    if (!axisName || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    console.log("axisDataaaaaaaa", axisData);

    const mongoose = await connectToDatabase();

    const user = await mongoose.connection.db
      .collection("users")
      .findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPlusUser = !!user.philosiqPlusActive;

    if (!isPlusUser) {
      return res.status(403).json({
        error: "This feature is only available for Philosiq+ users",
      });
    }

    console.log("=== AXIS SUMMARY REQUEST DEBUG ===");
    console.log("Axis:", axisName);
    console.log("User tier:", isPlusUser ? "PhilosiQ+" : "Free");
    console.log("Total answers for this axis:", answers.length);
    console.log("Sample answer structure:", answers.slice(0, 2));

    const existingSummary = await mongoose.connection.db
      .collection("ai_axis_summaries")
      .findOne({
        userEmail: userEmail,
        axisName: axisName,
        answersHash: JSON.stringify(answers).length,
      });

    if (
      existingSummary &&
      existingSummary.summary &&
      existingSummary.summary !== "undefined"
    ) {
      return res.status(200).json({
        summary: existingSummary.summary,
        cached: true,
        axisName: axisName,
      });
    }

    const axisPrompt = getAxisPrompt(axisName);
    let formattedPrompt = formatPrompt(axisPrompt.user, answers, axisName);

    if (
      axisData &&
      axisData.leftPercent !== undefined &&
      axisData.rightPercent !== undefined
    ) {
      const leftP = Number(axisData.leftPercent).toFixed(2);
      const rightP = Number(axisData.rightPercent).toFixed(2);
      const posLabel = axisData.userPosition || "";
      const posStrength = axisData.positionStrength || "";

      const isModerate =
        (leftP >= 50 && leftP <= 55) || (rightP >= 50 && rightP <= 55);

      if (isModerate) {
        formattedPrompt += `\n\nSpecial Positioning Context:\n- Left: ${leftP}%\n- Right: ${rightP}%\n- Position: MODERATE/NEUTRAL on this axis\n\nIMPORTANT: Since this user scores in the moderate range (50-55%), provide a BALANCED analysis that discusses BOTH sides of this axis. Acknowledge their moderate position and explain how they likely see merit in both perspectives. Do not lean heavily toward one side - instead, focus on their nuanced, balanced approach to this dimension.`;
      } else {
        formattedPrompt += `\n\nAdditional Positioning Context:\n- Left: ${leftP}%\n- Right: ${rightP}%\n- Position: ${posLabel}${
          posStrength ? ` (${posStrength})` : ""
        }`;
      }
    }

    const strongAnswers = answers.filter(
      (answer) => Math.abs(answer.answer) === 2
    );

    console.log("=== STRONG ANSWERS DEBUG ===");
    console.log("Total answers:", answers.length);
    console.log("Strong answers count:", strongAnswers.length);
    console.log("Sample answer structure:", answers[0]);
    console.log("Strong answers:", strongAnswers);

    if (strongAnswers.length > 0) {
      formattedPrompt += `\n\nKey Questions That Shaped Your Position:`;
      strongAnswers.forEach((answer, index) => {
        const stance =
          answer.answer === 2 ? "Strongly Agreed" : "Strongly Disagreed";

        let questionText = answer.question;
        if (!questionText || questionText === "undefined") {
          if (answer.axis) {
            questionText = `A question about ${answer.axis} (answer: ${answer.answer})`;
          } else {
            questionText = `Question ${index + 1} (answer: ${answer.answer})`;
          }
        }

        formattedPrompt += `\n${index + 1}. ${stance} with: "${questionText}"`;
      });
      formattedPrompt += `\n\nPlease reference these specific questions and stances in your analysis to make it more personal and concrete.`;
    }

    console.log("Prompt length:", formattedPrompt);
    console.log("=== SAMPLE PROMPT ===");
    console.log(formattedPrompt.substring(0, 500) + "...");
    console.log("=== END PROMPT DEBUG ===");

    const models = ["gpt-3.5-turbo-0125", "gpt-3.5-turbo", "gpt-4o-mini"];
    let openaiResponse = null;
    let lastError = null;

    for (const model of models) {
      try {
        console.log(`Trying OpenAI model: ${model}`);

        openaiResponse = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: "system",
                  content: axisPrompt.system,
                },
                {
                  role: "user",
                  content: formattedPrompt,
                },
              ],
              max_tokens: 1200, 
              temperature: 0.7,
            }),
          }
        );

        if (openaiResponse.ok) {
          console.log(`Successfully used model: ${model}`);
          break;
        } else {
          lastError = `Model ${model} failed with status: ${openaiResponse.status}`;
          console.log(lastError);

          if (openaiResponse.status === 429) {
            const waitTime = 5000; 
            console.log(`Rate limited, waiting ${waitTime / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        }
      } catch (error) {
        lastError = `Model ${model} error: ${error.message}`;
        console.log(lastError);
      }
    }

    if (!openaiResponse || !openaiResponse.ok) {
      console.error("All OpenAI models failed:", lastError);
      return res.status(500).json({
        error: "AI service temporarily unavailable. Please try again later.",
      });
    }

    const openaiData = await openaiResponse.json();
    let summary = openaiData.choices[0]?.message?.content?.trim();

    summary = summary.replace(/undefined/gi, "").trim();

    if (!summary) {
      return res.status(500).json({
        error: "Failed to generate summary from AI service",
      });
    }

    console.log("Generated summary length:", summary.length);
    console.log("Sample summary:", summary.substring(0, 100) + "...");

    try {
      await mongoose.connection.db.collection("ai_axis_summaries").insertOne({
        userEmail: userEmail,
        axisName: axisName,
        answersHash: JSON.stringify(answers).length,
        summary: summary,
        createdAt: new Date(),
        tokensUsed: openaiData.usage?.total_tokens || 0,
      });
    } catch (dbError) {
      console.error("Failed to save summary to database:", dbError);
    }

    return res.status(200).json({
      summary: summary,
      cached: false,
      axisName: axisName,
      tokensUsed: openaiData.usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error("Axis summary generation error:", error);
    return res.status(500).json({
      error: "Failed to generate axis summary",
    });
  }
}
