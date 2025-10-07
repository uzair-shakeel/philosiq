import connectToDatabase from "../../../lib/mongodb";
import { getGeneralPrompt, formatPrompt } from "../../../lib/ai-prompts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { answers, userId, userEmail, axisDataByName, rawData } = req.body;

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

    // Filter and process answers to reduce data sent to AI
    console.log("=== AI SUMMARY REQUEST DEBUG ===");
    console.log("User tier:", isPlusUser ? "PhilosiQ+" : "Free/Anonymous");
    console.log("Total answers received:", answers.length);
    console.log("Raw data available:", !!rawData);

    // Step 1: Get questions with user-added context
    const questionsWithContext = [];
    if (rawData?.contextTexts && rawData?.questions) {
      Object.entries(rawData.contextTexts).forEach(([questionId, contextText]) => {
        if (contextText && contextText.trim().length > 0) {
          const question = rawData.questions.find(q => q._id === questionId);
          const answer = rawData.answers?.[questionId];
          if (question && answer !== undefined) {
            questionsWithContext.push({
              question: question.question,
              answer: answer,
              axis: question.axis || "general",
              context: contextText,
              questionId: questionId
            });
          }
        }
      });
    }
    console.log("Questions with user context:", questionsWithContext.length);

    // Step 2: Get top 3 highest impact questions per axis from answerBreakdown
    const topQuestionsByAxis = {};
    if (rawData?.answerBreakdown && Array.isArray(rawData.answerBreakdown)) {
      // Group by axis
      const byAxis = {};
      rawData.answerBreakdown.forEach(item => {
        const axis = item.axis || "general";
        if (!byAxis[axis]) byAxis[axis] = [];
        byAxis[axis].push(item);
      });

      // Get top 3 per axis based on absolute contribution
      Object.entries(byAxis).forEach(([axis, items]) => {
        const sorted = items
          .filter(item => Math.abs(item.contribution) >= 5) // Only high impact (±5 or more)
          .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
          .slice(0, 3);
        
        if (sorted.length > 0) {
          topQuestionsByAxis[axis] = sorted.map(item => ({
            question: item.question,
            answer: item.answer,
            axis: axis,
            contribution: item.contribution
          }));
        }
      });
    }
    console.log("Top questions by axis:", Object.keys(topQuestionsByAxis).length, "axes");

    // Step 3: Combine unique questions (avoid duplicates)
    const processedAnswers = [];
    const addedQuestionIds = new Set();

    // Add questions with context first
    questionsWithContext.forEach(q => {
      if (!addedQuestionIds.has(q.questionId)) {
        processedAnswers.push(q);
        addedQuestionIds.add(q.questionId);
      }
    });

    // Add top questions per axis
    Object.values(topQuestionsByAxis).forEach(axisQuestions => {
      axisQuestions.forEach(q => {
        // Use question text as ID since we don't have questionId here
        const id = q.question;
        if (!addedQuestionIds.has(id)) {
          processedAnswers.push(q);
          addedQuestionIds.add(id);
        }
      });
    });

    console.log("Final processed answers:", processedAnswers.length);
    console.log("Breakdown - With context:", questionsWithContext.length, "Top impact:", processedAnswers.length - questionsWithContext.length);
    
    let isLimited = false;

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
    
    // Build a more focused prompt with axis scores first
    let formattedPrompt = "";
    
    // Add axis positioning data at the top
    if (axisDataByName && Object.keys(axisDataByName).length > 0) {
      formattedPrompt += "USER'S POLITICAL POSITIONING:\n";
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
          formattedPrompt += `- ${axisName}: ${leftP}% ${data.leftLabel}, ${rightP}% ${data.rightLabel} (${posLabel}${
            posStrength ? ` - ${posStrength}` : ""
          })\n`;
        }
      });
      formattedPrompt += "\n";
    }
    
    // Add the selected questions
    if (processedAnswers.length > 0) {
      formattedPrompt += "KEY QUESTIONS & ANSWERS:\n";
      formattedPrompt += "Answer values: 2=Strongly Agree, 1=Agree, 0=Neutral, -1=Disagree, -2=Strongly Disagree\n\n";
      
      processedAnswers.forEach((q, i) => {
        formattedPrompt += `${i + 1}. [${q.axis}] ${q.question}: ${q.answer}`;
        if (q.context) {
          formattedPrompt += ` (User's context: "${q.context}")`;
        }
        if (q.contribution) {
          formattedPrompt += ` [Impact: ${q.contribution > 0 ? '+' : ''}${q.contribution}]`;
        }
        formattedPrompt += "\n";
      });
    }
    
    formattedPrompt += "\n" + generalPrompt.user.replace("{ANSWERS}", "").trim();

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
