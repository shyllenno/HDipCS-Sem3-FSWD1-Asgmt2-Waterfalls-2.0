import Mongoose from "mongoose";
import { UserSchema } from "./mongoSchemas.js";

export const userMongoStore = {
  async getAllUsers() {
    const users = await UserSchema.find().lean();
    return users;
  },

  async getUserById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const user = await UserSchema.findOne({ _id: id }).lean();
      return user;
    }
    return null;
  },

  async addUser(user) {
    const newUser = new UserSchema(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },

  async getUserByEmail(email) {
    const user = await UserSchema.findOne({ email: email }).lean();
    return user;
  },

  async deleteUserById(id) {
    try {
      await UserSchema.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAll() {
    await UserSchema.deleteMany({});
  }
};
