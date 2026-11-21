import { Schema } from 'mongoose';
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
  },
  { timestamps: true, collection: 'users' },
);

export default UserSchema;
