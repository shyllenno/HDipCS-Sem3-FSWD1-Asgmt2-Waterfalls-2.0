import Mongoose from "mongoose";
import { WaterfallSchema, ReviewSchema } from "./mongoSchemas.js";
import Boom from "@hapi/boom";

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

  async addReview(review) {
    const waterfall = await WaterfallSchema.findById(review.waterfallid);
    if (!waterfall) throw Boom.notFound("Waterfall not found");

    const newReview = new ReviewSchema(review);
    const reviewObj = await newReview.save();
    return reviewObj;
  },

}


