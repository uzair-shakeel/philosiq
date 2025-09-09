import connectToDatabase from "../../../lib/mongodb";
import { getGeneralPrompt, formatPrompt } from "../../../lib/ai-prompts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { answers, userId, userEmail, axisDataByName } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid answers data" });
    }

    // Connect to database
    const mongoose = await connectToDatabase();

    // Get user info (optional - allow anonymous users)
    let user = null;
    let isPlusUser = false;

    if (userEmail && userEmail.trim() !== "") {
      user = await mongoose.connection.db
        .collection("users")
        .findOne({ email: userEmail });

      if (user) {
        isPlusUser = !!user.philosiqPlusActive;
      }
    }

    // For free users (including anonymous), use all answers for better accuracy
    let processedAnswers = answers;
    let isLimited = false;

    console.log("=== AI SUMMARY REQUEST DEBUG ===");
    console.log("User tier:", isPlusUser ? "PhilosiQ+" : "Free/Anonymous");
    console.log("Total answers received:", answers.length);
    console.log("Sample answer structure:", answers.slice(0, 2));
    console.log("User email:", userEmail || "Anonymous");

    // Note: All users now get analysis of their complete answers for better accuracy
    console.log("Using all answers for analysis (no limit)");
    console.log("Final processed answers:", processedAnswers.length);
    console.log("Sample processed answer:", processedAnswers[0]);

    // Check if we already have a cached summary for this user (or anonymous session)
    const cacheKey =
      userEmail || `anonymous_${JSON.stringify(processedAnswers).length}`;
    const existingSummary = await mongoose.connection.db
      .collection("ai_summaries")
      .findOne({
        userEmail: cacheKey,
        answersHash: JSON.stringify(processedAnswers).length,
        isPlusUser: isPlusUser,
      });

    if (existingSummary) {
      return res.status(200).json({
        summary: existingSummary.summary,
        cached: true,
        isLimited: existingSummary.isLimited,
        totalAnswers: answers.length,
        processedAnswers: processedAnswers.length,
      });
    }

    // Get the specialized prompt for general analysis
    const generalPrompt = getGeneralPrompt();
    let formattedPrompt = formatPrompt(generalPrompt.user, processedAnswers);

    // If axis data provided, append positioning context for all axes
    if (axisDataByName && Object.keys(axisDataByName).length > 0) {
      console.log("Adding axis positioning data to general prompt");
      formattedPrompt += "\n\nYour Calculated Political Positioning:";
      Object.entries(axisDataByName).forEach(([axisName, data]) => {
        if (
          data &&
          data.leftPercent !== undefined &&
          data.rightPercent !== undefined
        ) {
          const leftP = Number(data.leftPercent).toFixed(1);
          const rightP = Number(data.rightPercent).toFixed(1);
          const posLabel = data.userPosition || "";
          const posStrength = data.positionStrength || "";
          formattedPrompt += `\n- ${axisName}: ${leftP}% Left, ${rightP}% Right (${posLabel}${
            posStrength ? ` - ${posStrength}` : ""
          })`;
        }
      });
      formattedPrompt +=
        "\n\nPlease reference these specific percentages and positions in your analysis.";
    }

    // Set max tokens - increased for more comprehensive summaries
    const maxTokens = 3000;

    console.log("Final prompt length:", formattedPrompt.length);
    console.log("Max tokens:", maxTokens);
    console.log("=== SAMPLE PROMPT ===");
    console.log(formattedPrompt.substring(0, 500) + "...");
    console.log("=== END PROMPT DEBUG ===");

    // Try different models with fallback
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
                  content: generalPrompt.system,
                },
                {
                  role: "user",
                  content: formattedPrompt,
                },
              ],
              max_tokens: maxTokens,
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

          // If rate limited, wait longer before trying next model
          if (openaiResponse.status === 429) {
            const waitTime = 5000; // Wait 5 seconds for rate limits
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
      throw new Error(`All models failed. Last error: ${lastError}`);
    }

    const openaiData = await openaiResponse.json();
    let summary = openaiData.choices[0].message.content.trim();

    // Simple fix: replace "undefined" with empty string
    summary = summary.replace(/undefined/gi, "").trim();

    // Cache the summary in database
    await mongoose.connection.db.collection("ai_summaries").insertOne({
      userEmail: cacheKey,
      userId: userId,
      answersHash: JSON.stringify(processedAnswers).length,
      summary: summary,
      createdAt: new Date(),
      model: "gpt-3.5-turbo",
      tokensUsed: openaiData.usage?.total_tokens || 0,
      isPlusUser: isPlusUser,
      isLimited: isLimited,
      totalAnswers: answers.length,
      processedAnswers: processedAnswers.length,
    });

    res.status(200).json({
      summary: summary,
      cached: false,
      tokensUsed: openaiData.usage?.total_tokens || 0,
      isLimited: isLimited,
      totalAnswers: answers.length,
      processedAnswers: processedAnswers.length,
    });
  } catch (error) {
    console.error("AI Summary generation error:", error);
    res.status(500).json({
      error: "Failed to generate personality summary",
      details: error.message,
    });
  }
}
