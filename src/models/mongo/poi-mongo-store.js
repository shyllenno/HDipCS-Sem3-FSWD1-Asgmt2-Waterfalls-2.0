import Mongoose from "mongoose";
import { POISchema } from "./mongoSchemas.js";

export const poiMongoStore = {
  async getAllPOIs() {
    const pois = await POISchema.find().lean();
    return pois;
  },

  async getPOIById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const poi = await POISchema.findOne({ _id: id }).lean();
      return poi;
    }
    return null;
  },

  async getPOIsByWaterfallId(id) {
    const pois = await POISchema.find({ waterfallid: id }).lean();
    return pois;
  },

  async addPOI(poi) {
    const newPOI = new POISchema(poi);
    const poiObj = await newPOI.save();
    const p = await this.getPOIById(poiObj._id);
    return p;
  },

  async deletePOIById(id) {
    try {
      await POISchema.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPOIs() {
    await POISchema.deleteMany({});
  },
};
