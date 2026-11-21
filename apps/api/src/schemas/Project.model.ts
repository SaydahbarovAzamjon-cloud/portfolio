import { Schema } from 'mongoose';
import { ProjectCategory, ProjectStatus } from '../libs/enums/project.enum';
import { LocalizedTextSchema, MediaSchema } from './common';

const ProjectHighlightSchema = new Schema(
  {
    icon: {
      type: String,
      required: true,
    },

    label: {
      type: LocalizedTextSchema,
      required: true,
    },
  },
  { _id: false },
);

const ProjectSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },

    /** Brand name, not translated (Fixora, CarVia, ...). */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: LocalizedTextSchema,
      required: true,
    },

    summary: {
      type: LocalizedTextSchema,
      required: true,
    },

    category: {
      type: String,
      enum: ProjectCategory,
      required: true,
    },

    status: {
      type: String,
      enum: ProjectStatus,
      default: ProjectStatus.COMPLETED,
    },

    order: {
      type: Number,
      default: 0,
    },

    showOnHome: {
      type: Boolean,
      default: false,
    },

    skillIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Skill',
      default: [],
    },

    links: {
      live: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      demo: {
        type: String,
        trim: true,
      },
    },

    media: {
      cover: {
        type: MediaSchema,
      },
      thumbnail: {
        type: MediaSchema,
      },
      /** Device mockups (laptop / phone) used in galleries. */
      mockups: {
        type: [MediaSchema],
        default: [],
      },
      gallery: {
        type: [MediaSchema],
        default: [],
      },
    },

    theme: {
      /** Accent colour for the card, e.g. "#8b5cf6" for Lumora. */
      accent: {
        type: String,
        match: /^#[0-9a-fA-F]{6}$/,
      },
      /** Card uses a dark background (e.g. CarVia). */
      dark: {
        type: Boolean,
        default: false,
      },
    },

    highlights: {
      type: [ProjectHighlightSchema],
      default: [],
    },

    /** Case study page content. Text fields accept markdown. */
    caseStudy: {
      overview: {
        type: LocalizedTextSchema,
      },
      problem: {
        type: LocalizedTextSchema,
      },
      solution: {
        type: LocalizedTextSchema,
      },
      architecture: {
        type: LocalizedTextSchema,
      },
      features: {
        type: [LocalizedTextSchema],
        default: [],
      },
      challenges: {
        type: [LocalizedTextSchema],
        default: [],
      },
      results: {
        type: [LocalizedTextSchema],
        default: [],
      },
      role: {
        type: LocalizedTextSchema,
      },
      teamSize: {
        type: Number,
        min: 1,
      },
      duration: {
        type: LocalizedTextSchema,
      },
    },

    period: {
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: 'projects' },
);

ProjectSchema.index({ isPublished: 1, order: 1 });
ProjectSchema.index({ isPublished: 1, showOnHome: 1, order: 1 });

export default ProjectSchema;
