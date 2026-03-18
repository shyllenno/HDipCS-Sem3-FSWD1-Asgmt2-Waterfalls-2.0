import Mongoose from "mongoose";

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

export const UserSchema = Mongoose.model("Users", userSchema);

const waterfallSchema = new Schema({
  name: String,
  description: String,
  latitude: Number,
  longitude: Number,
  userid: Mongoose.Schema.Types.ObjectId,
});

export const WaterfallSchema = Mongoose.model("Waterfalls", waterfallSchema);

const poiSchema = new Schema({
  type: String,
  description: String,
  latitude: Number,
  longitude: Number,
  waterfallid: Mongoose.Schema.Types.ObjectId,
});

export const POISchema = Mongoose.model("POIs", poiSchema);