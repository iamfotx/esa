import type { Document, Model } from "mongoose";
import type { User } from "~/types.server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";
const SALT_WORK_FACTOR = 10;

interface UserDocument extends Omit<User, "id" | "password">, Document {
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  hashPassword: (password: string) => Promise<string>;
}

const userSchema = new mongoose.Schema<UserDocument, Model<UserDocument>>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Duplicate the ID field.
userSchema.virtual("id").get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    delete ret._id;
  },
});

userSchema.methods.hashPassword = async function comparePassword(
  password: string
) {
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const result = await bcrypt.hash(password, salt);
  return result;
};

userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string
) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  return result;
};

userSchema.pre<UserDocument>("save", async function cb(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    invariant(this.password, "user always should");
    this.password = await this.hashPassword(this.password);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

export default mongoose.model<UserDocument, Model<UserDocument>>(
  "User",
  userSchema
);
