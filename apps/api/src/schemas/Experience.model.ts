import { Schema } from 'mongoose';
import { EmploymentType } from '../libs/enums/experience.enum';
import { LocalizedTextSchema, MediaSchema } from './common';

const ExperienceSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: MediaSchema,
    },

    companyImage: {
      type: MediaSchema,
    },

    role: {
      type: LocalizedTextSchema,
      required: true,
    },

    employmentType: {
      type: String,
      enum: EmploymentType,
      default: EmploymentType.FULL_TIME,
    },

    location: {
      type: LocalizedTextSchema,
    },

    startDate: {
      type: Date,
      required: true,
    },

    /** null = current position. Duration is computed, not stored. */
    endDate: {
      type: Date,
      default: null,
    },

    summary: {
      type: LocalizedTextSchema,
    },

    responsibilities: {
      type: [LocalizedTextSchema],
      default: [],
    },

    achievements: {
      type: [LocalizedTextSchema],
      default: [],
    },

    skillIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Skill',
      default: [],
    },

    projectIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Project',
      default: [],
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true, collection: 'experiences' },
);

ExperienceSchema.index({ startDate: -1 });

export default ExperienceSchema;
