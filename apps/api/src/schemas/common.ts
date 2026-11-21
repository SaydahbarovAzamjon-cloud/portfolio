import { Schema } from 'mongoose';

/**
 * Shared embedded sub-schemas (no own _id). See docs/DATA_MODEL.md §0.
 */

/** Human-readable text. `en` is required; `ko` falls back to `en` on the frontend. */
export const LocalizedTextSchema = new Schema(
  {
    en: {
      type: String,
      required: true,
      trim: true,
    },

    ko: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

/** An image or file stored on the VPS disk (see `uploads`). */
export const MediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: LocalizedTextSchema,
    },

    width: {
      type: Number,
      min: 0,
    },

    height: {
      type: Number,
      min: 0,
    },

    /** Tiny base64 placeholder for blur-up loading. */
    blurDataUrl: {
      type: String,
    },
  },
  { _id: false },
);

/** Icon + title + description tile (feature cards, philosophy, contributions). */
export const IconCardSchema = new Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: LocalizedTextSchema,
      required: true,
    },

    description: {
      type: LocalizedTextSchema,
    },
  },
  { _id: false },
);

/** A number that cannot be computed from data (e.g. "20+ technologies"). */
export const StatSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: LocalizedTextSchema,
      required: true,
    },
  },
  { _id: false },
);
