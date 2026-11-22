import { InferSchemaType, Schema } from 'mongoose';

/** One refresh-token session. The raw token lives only in an httpOnly cookie. */
const AuthSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    userAgent: {
      type: String,
    },

    ipHash: {
      type: String,
    },

    /** TTL index: MongoDB removes the session once it expires. */
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },

    revokedAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'auth_sessions' },
);

/** TypeScript type of a session document, inferred from the schema above. */
export type AuthSession = InferSchemaType<typeof AuthSessionSchema>;

export default AuthSessionSchema;
