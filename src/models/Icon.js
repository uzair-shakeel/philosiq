import mongoose from "mongoose";

// Define the Icon schema for famous people profiles
const IconSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    iqryptCode: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
    },
    wikipediaTitle: {
      type: String,
      required: [true, "Wikipedia title is required"],
      unique: true,
      trim: true,
    },
    wikipediaPageId: {
      type: Number,
      required: [true, "Wikipedia page ID is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      required: false,
    },
    occupation: {
      type: String,
      required: [true, "Occupation is required"],
      trim: true,
    },
    birthDate: {
      type: String,
    },
    deathDate: {
      type: String,
    },
    nationality: {
      type: String,
    },
    // Character type classification
    characterType: {
      type: String,
      enum: ["real", "fictional"],
      default: "real",
    },
    isFictional: {
      type: Boolean,
      default: false,
    },
    // Source media for fictional characters
    sourceMedia: {
      type: String,
      trim: true,
    },
    // Political compass scores (calculated from answers)
    scores: {
      equityVsFreeMarket: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
      libertarianVsAuthoritarian: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
      progressiveVsConservative: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
      secularVsReligious: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
      globalismVsNationalism: {
        type: Number,
        default: 0,
        min: -100,
        max: 100,
      },
    },
    createdBy: {
      type: String,
      required: [true, "Creator is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalAnswers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
IconSchema.index({ name: "text", description: "text", occupation: "text" });
IconSchema.index({ createdBy: 1 });
IconSchema.index({ iqryptCode: 1 }, { unique: true, sparse: true });

// Helper to generate a stable IQrypt code from a name
function generateIqryptBaseFromName(name) {
  if (!name || typeof name !== "string") return null;
  const cleaned = name
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;
  const parts = cleaned.split(" ");
  const first = parts[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1] : cleaned;
  const firstInitial = first.charAt(0);
  const slug = (str) =>
    str
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const base = `${slug(firstInitial)}-${slug(last)}`.replace(/^-+/, "");
  return base || null;
}

// Pre-validate hook to set iqryptCode if missing and ensure uniqueness
IconSchema.pre("validate", async function (next) {
  try {
    if (!this.iqryptCode && this.name) {
      const base = generateIqryptBaseFromName(this.name);
      if (base) {
        let code = base;
        let suffix = 1;
        // Ensure uniqueness; exclude self when updating
        // Note: use mongoose.models.Icon to avoid model redefinition
        // eslint-disable-next-line no-constant-condition
        while (
          await mongoose.models.Icon.exists({
            iqryptCode: code,
            _id: { $ne: this._id },
          })
        ) {
          suffix += 1;
          code = `${base}-${suffix}`;
        }
        this.iqryptCode = code;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Also handle direct document save
IconSchema.pre("save", async function (next) {
  try {
    if (!this.iqryptCode && this.name) {
      const base = generateIqryptBaseFromName(this.name);
      if (base) {
        let code = base;
        let suffix = 1;
        while (
          await mongoose.models.Icon.exists({ iqryptCode: code, _id: { $ne: this._id } })
        ) {
          suffix += 1;
          code = `${base}-${suffix}`;
        }
        this.iqryptCode = code;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

// And when using findOneAndUpdate (used by PUT APIs)
IconSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate() || {};
    const set = update.$set || update;
    // If caller explicitly sets iqryptCode, respect it; otherwise generate if name is changing or code missing
    if (!set.iqryptCode && set.name) {
      const base = generateIqryptBaseFromName(set.name);
      if (base) {
        let code = base;
        let suffix = 1;
        const docId = this.getQuery()?._id;
        while (
          await mongoose.models.Icon.exists({ iqryptCode: code, _id: { $ne: docId } })
        ) {
          suffix += 1;
          code = `${base}-${suffix}`;
        }
        // Apply back onto the update
        if (update.$set) update.$set.iqryptCode = code;
        else update.iqryptCode = code;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.models.Icon || mongoose.model("Icon", IconSchema);
