import { Schema } from 'mongoose';
import { LocalizedTextSchema } from './common';

const SkillCategorySchema = new Schema(
  {
    /** Stable key: frontend, backend, ai-ml, infrastructure. */
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: LocalizedTextSchema,
      required: true,
    },

    description: {
      type: LocalizedTextSchema,
    },

    icon: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true, collection: 'skill_categories' },
);

export default SkillCategorySchema;
