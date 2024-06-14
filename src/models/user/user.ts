import { Model, Schema, model } from "mongoose";
import { UserAttributes } from "./params/user-params";

export interface UserModel extends Model<UserDocument> {
  addOne(user: UserAttributes): UserDocument;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  createdAt: Date;
}
export const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.addOne = function (user: UserAttributes) {
  return new User(user).save();
};

export const User = model<UserDocument, UserModel>("User", userSchema);
