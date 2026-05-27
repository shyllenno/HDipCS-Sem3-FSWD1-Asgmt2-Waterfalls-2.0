import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, ReviewSpec, ReviewSpecPlus, ReviewArray } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const reviewApi = {

  waterfallReviews: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const reviews = await db.reviewStore.getReviewsByWaterfallId(request.params.id);
        return reviews;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all reviews for a waterfall",
    notes: "Returns an array of reviews",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: ReviewArray, failAction: validationError },
  },

  create: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const waterfallId = request.params.id;

        const waterfall = await db.waterfallStore.getWaterfallById(waterfallId);
        if (!waterfall) {
          return Boom.notFound("No Waterfall with this id");
        }

        const reviewPayload = {
          ...request.payload,
          waterfallid: waterfallId,
        };

        const newReview = await db.reviewStore.addReview(reviewPayload);

        if (newReview) {
          return h.response(JSON.parse(JSON.stringify(newReview))).code(201);
        }
        return Boom.badImplementation("Error creating review");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a review",
    notes: "Returns the newly created review",
    validate: { payload: ReviewSpec, params: { id: IdSpec }, failAction: validationError },
    response: { schema: ReviewSpecPlus, failAction: validationError },
  },

  averageRating: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const stats = await db.reviewStore.getAverageRating(request.params.id);
        return stats;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get average rating for a waterfall",
    notes: "Returns { avg, count }",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.reviewStore.deleteAllReviews();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all reviews",
  },

  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const review = await db.reviewStore.getReviewById(request.params.reviewId);
        if (!review) {
          return Boom.notFound("No Review with this id");
        }

        await db.reviewStore.deleteReviewById(review._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a review",
    validate: { params: { reviewId: IdSpec }, failAction: validationError },
  },
};
