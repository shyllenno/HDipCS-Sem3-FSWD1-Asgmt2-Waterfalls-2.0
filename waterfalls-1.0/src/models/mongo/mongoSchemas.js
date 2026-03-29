import Mongoose from "mongoose";
import Boom from "@hapi/boom";

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

userSchema.methods.comparePassword = function (candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw Boom.unauthorized("Password mismatch");
  }
  return this;
};

export const UserSchema = Mongoose.model("Users", userSchema);

const waterfallSchema = new Schema({
  name: String,
  description: String,
  latitude: Number,
  longitude: Number,
  userid: { type: Mongoose.Schema.Types.ObjectId, ref: "Users" },
});

export const WaterfallSchema = Mongoose.model("Waterfalls", waterfallSchema);

const poiSchema = new Schema({
  type: String,
  description: String,
  latitude: Number,
  longitude: Number,
  waterfallid: { type: Mongoose.Schema.Types.ObjectId, ref: "Waterfalls" },
});

export const POISchema = Mongoose.model("POIs", poiSchema);