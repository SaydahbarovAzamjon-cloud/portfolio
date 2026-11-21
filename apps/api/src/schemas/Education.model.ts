import { Schema } from 'mongoose';
import { DegreeType, EducationStatus } from '../libs/enums/education.enum';
import { LocalizedTextSchema, MediaSchema } from './common';

const EducationSchema = new Schema(
  {
    degree: {
      type: String,
      enum: DegreeType,
      required: true,
    },

    institution: {
      type: LocalizedTextSchema,
      required: true,
    },

    /** Name in the institution's own language, e.g. "Toshkent davlat transport universiteti". */
    institutionNative: {
      type: String,
      trim: true,
    },

    program: {
      type: LocalizedTextSchema,
    },

    major: {
      type: LocalizedTextSchema,
    },

    qualification: {
      type: LocalizedTextSchema,
    },

    location: {
      type: LocalizedTextSchema,
    },

    startDate: {
      type: Date,
      required: true,
    },

    /** Graduation date, or expected graduation while IN_PROGRESS. */
    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: EducationStatus,
      required: true,
    },

    image: {
      type: MediaSchema,
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true, collection: 'education' },
);

export default EducationSchema;
