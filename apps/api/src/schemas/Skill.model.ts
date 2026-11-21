import { Schema } from 'mongoose';

/** One technology. Projects and experiences reference skills, so names and icons stay consistent. */
const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    /** Simple Icons slug or custom icon key. */
    icon: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SkillCategory',
      index: true,
    },

    /** Shown in the Home "Tools I Work With" preview. */
    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: 'skills' },
);

SkillSchema.index({ categoryId: 1, order: 1 });

export default SkillSchema;
