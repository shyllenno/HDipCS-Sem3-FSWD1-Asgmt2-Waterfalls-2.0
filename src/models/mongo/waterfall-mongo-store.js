import Mongoose from "mongoose";
import { WaterfallSchema } from "./mongoSchemas.js";
import { poiMongoStore } from "./poi-mongo-store.js";

export const waterfallMongoStore = {
  async getUserWaterfalls(userid) {
    const waterfalls = await WaterfallSchema.find({ userid: userid }).lean();
    return waterfalls;
  },

  async getAllWaterfalls() {
    const waterfalls = await WaterfallSchema.find().lean();
    return waterfalls;
  },

  async getWaterfallById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const waterfall = await WaterfallSchema.findOne({ _id: id }).lean();
      if (!waterfall) return null;
      waterfall.POIs = await poiMongoStore.getPOIsByWaterfallId(id);

      return waterfall;
    }
    return null;
  },

  async addWaterfall(waterfall) {
    const newWaterfall = new WaterfallSchema(waterfall);
    const waterfallObj = await newWaterfall.save();
    const w = await this.getWaterfallById(waterfallObj._id);
    return w;
  },

  async deleteWaterfallById(id) {
    try {
      await WaterfallSchema.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllWaterfalls() {
    await WaterfallSchema.deleteMany({});
  },

  async updateWaterfall(id, updatedFields) {
    return WaterfallSchema.findByIdAndUpdate(id, updatedFields, { returnDocument: "after" });
  },

  // References:
  // https://www.mongodb.com/docs/manual/reference/operator/query/regex/
  // https://www.mongodb.com/community/forums/t/searching-multiple-fields/1457/6
  async searchEverywhere(userId, query) {
    return WaterfallSchema.find({
      userid: userId,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$latitude" },
              regex: query,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$longitude" },
              regex: query,
              options: "i",
            },
          },
        },
      ],
    }).lean();
  },
};
