import { connectToDatabase } from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { code } = req.query;
    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Code is required" });
    }

    const { db } = await connectToDatabase();

    const record = await db.collection("compare_codes").findOne({ code });
    if (!record) {
      // Fallback: try resolving as an Icon IQrypt code
      let icon = await db
        .collection("icons")
        .findOne({ iqryptCode: code, isActive: true });
      if (!icon) {
        // Attempt heuristic search by parsing code: f-lastname
        const m = /^([a-z0-9]+)-([a-z0-9-]+)$/i.exec(code || "");
        if (m) {
          const firstInit = m[1];
          const lastSlug = m[2];
          // Build a case-insensitive regex for last name token
          const lastRegex = new RegExp(`\\b${lastSlug.replace(/[-_]+/g, "[\\s-]+")}\\b`, "i");
          const candidates = await db
            .collection("icons")
            .find({ isActive: true, name: { $regex: lastRegex } })
            .project({ name: 1, scores: 1, createdBy: 1, createdAt: 1, iqryptCode: 1 })
            .limit(20)
            .toArray();

          const slug = (str) =>
            (str || "")
              .toLowerCase()
              .normalize("NFKD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
          const gen = (name) => {
            const cleaned = (name || "").replace(/\s+/g, " ").trim();
            const parts = cleaned.split(" ");
            const first = parts[0] || "";
            const last = parts.length > 1 ? parts[parts.length - 1] : cleaned;
            return `${slug(first.charAt(0))}-${slug(last)}`.replace(/^-+/, "");
          };

          for (const c of candidates) {
            const candidateCode = gen(c.name);
            if (candidateCode === code) {
              icon = c;
              // Backfill iqryptCode asynchronously (best-effort)
              try {
                await db.collection("icons").updateOne(
                  { _id: icon._id },
                  { $set: { iqryptCode: code } }
                );
              } catch (_) {}
              break;
            }
          }
        }
      }
      if (!icon) {
        return res
          .status(404)
          .json({ success: false, message: "Code not found" });
      }

      // Map Icon scores (-100..100) to compare axisBreakdown (0..100)
      const mapScore = (v) => {
        const n = typeof v === "number" ? v : 0;
        return Math.max(0, Math.min(100, (n + 100) / 2));
      };
      const axisBreakdown = [
        {
          name: "Equity vs. Free Market",
          leftLabel: "Equity",
          rightLabel: "Free Market",
          score: mapScore(icon.scores?.equityVsFreeMarket),
        },
        {
          name: "Libertarian vs. Authoritarian",
          leftLabel: "Libertarian",
          rightLabel: "Authoritarian",
          score: mapScore(icon.scores?.libertarianVsAuthoritarian),
        },
        {
          name: "Progressive vs. Conservative",
          leftLabel: "Progressive",
          rightLabel: "Conservative",
          score: mapScore(icon.scores?.progressiveVsConservative),
        },
        {
          name: "Secular vs. Religious",
          leftLabel: "Secular",
          rightLabel: "Religious",
          score: mapScore(icon.scores?.secularVsReligious),
        },
        {
          name: "Globalism vs. Nationalism",
          leftLabel: "Globalism",
          rightLabel: "Nationalism",
          score: mapScore(icon.scores?.globalismVsNationalism),
        },
      ];

      // Build per-question answerBreakdown from accepted Icon answers
      const ansTextToNum = (t) => {
        switch ((t || '').toLowerCase()) {
          case 'strongly agree': return 2;
          case 'agree': return 1;
          case 'neutral': return 0;
          case 'disagree': return -1;
          case 'strongly disagree': return -2;
          default: return null;
        }
      };

      let answerBreakdown = [];
      try {
        const iconAnswers = await db
          .collection("iconanswers")
          .find({ icon: icon._id, isActive: true, isAccepted: true })
          .project({ question: 1, answer: 1 })
          .toArray();
        const qIds = Array.from(new Set(iconAnswers.map(a => a.question).filter(Boolean)));
        let questionsById = {};
        if (qIds.length) {
          const questions = await db
            .collection("questions")
            .find({ _id: { $in: qIds } })
            .project({ axis: 1, topic: 1, question: 1 })
            .toArray();
          questionsById = Object.fromEntries(questions.map(q => [q._id.toString(), q]));
        }
        answerBreakdown = iconAnswers.map(a => {
          const q = questionsById[a.question?.toString?.()];
          return {
            questionId: a.question?.toString?.() || '',
            axis: q?.axis || '',
            topic: q?.topic || '',
            question: q?.question || '',
            answer: ansTextToNum(a.answer),
            // contribution omitted for icons; not needed for display
          };
        });
      } catch (_) {
        answerBreakdown = [];
      }

      const transformed = {
        _id: icon._id.toString(),
        userId: icon.createdBy?.toString?.() || "",
        archetype: { name: icon.name },
        axisBreakdown,
        answerBreakdown,
        createdAt: icon.createdAt,
        quizType: "icon",
      };

      return res.status(200).json({ success: true, result: transformed });
    }

    const result = await db
      .collection("quiz_results")
      .findOne({ _id: record.resultId });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Result not found" });
    }

    const transformed = {
      _id: result._id.toString(),
      userId: result.userId.toString(),
      archetype: result.archetype,
      axisBreakdown: result.axisBreakdown,
      answerBreakdown: result.answerBreakdown || [],
      createdAt: result.createdAt,
      quizType: result.quizType,
    };

    return res.status(200).json({ success: true, result: transformed });
  } catch (error) {
    console.error("Error resolving compare code:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to resolve code" });
  }
}
