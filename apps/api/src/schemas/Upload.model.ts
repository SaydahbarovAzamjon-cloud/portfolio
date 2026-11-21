import { Schema } from 'mongoose';

/** Metadata for a file saved on the VPS disk and served by Nginx under /uploads. */
const UploadSchema = new Schema(
  {
    /** Relative path inside the uploads directory, e.g. projects/2026/11/<uuid>.webp */
    path: {
      type: String,
      required: true,
      unique: true,
    },

    url: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    /** Bytes. */
    size: {
      type: Number,
      required: true,
      min: 0,
    },

    width: {
      type: Number,
      min: 0,
    },

    height: {
      type: Number,
      min: 0,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, collection: 'uploads' },
);

export default UploadSchema;
