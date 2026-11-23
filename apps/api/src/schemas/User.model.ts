import { InferSchemaType, Schema } from 'mongoose';
import { UserRole } from '../libs/enums/user.enum';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    /** argon2 hash. Excluded from queries by default. */
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: UserRole,
      default: UserRole.ADMIN,
    },

    lastLoginAt: {
      type: Date,
    },

    /** Email confirmation code for changing the password (hidden, one at a time). */
    passwordCode: {
      type: new Schema(
        {
          /** argon2 hash of the 6-digit code (never the code itself) */
          hash: { type: String, required: true },
          expiresAt: { type: Date, required: true },
          attempts: { type: Number, default: 0 },
        },
        { _id: false },
      ),
      select: false,
    },
  },
  { timestamps: true, collection: 'users' },
);

/** TypeScript type of a user document, inferred from the schema above. */
export type User = InferSchemaType<typeof UserSchema>;

export default UserSchema;
