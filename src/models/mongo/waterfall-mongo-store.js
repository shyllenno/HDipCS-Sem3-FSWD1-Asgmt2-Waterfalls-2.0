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
};
