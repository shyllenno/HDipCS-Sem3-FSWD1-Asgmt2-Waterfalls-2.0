import Mongoose from "mongoose";
import { WaterfallSchema, ReviewSchema } from "./mongoSchemas.js";

export const reviewMongoStore = {

  async getReviewsByWaterfallId(id) {
    if (Mongoose.isValidObjectId(id)) {
      const review = await ReviewSchema
        .find({ waterfallid: id })
        .populate("userid")
        .lean();
      if (!review) return null;

      return review;
    }
    return null;
  },

}


