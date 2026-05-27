import Boom from "@hapi/boom";
import { IdSpec, WaterfallArray, WaterfallSpec, WaterfallSpecPlus } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { validationError } from "./logger.js";

export const waterfallApi = {
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const waterfalls = await db.waterfallStore.getAllWaterfalls();
        return waterfalls;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: WaterfallArray, failAction: validationError },
    description: "Get all waterfalls",
    notes: "Returns all waterfalls",
  },

  findOne: {
    auth: { strategy: "jwt" },
    async handler(request) {
      try {
        const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
        if (!waterfall) {
          return Boom.notFound("No Waterfall with this id");
        }
        return waterfall;
      } catch (err) {
        return Boom.serverUnavailable("No Waterfall with this id");
      }
    },
    tags: ["api"],
    description: "Find a Waterfall",
    notes: "Returns a waterfall",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: WaterfallSpecPlus, failAction: validationError },
  },

  create: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const waterfall = request.payload;

        const newWaterfall = await db.waterfallStore.addWaterfall(waterfall);

        if (newWaterfall) {
          return h.response(newWaterfall).code(201);
        }
        return Boom.badImplementation("error creating waterfall");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a Waterfall",
    notes: "Returns the newly created waterfall",
    validate: { payload: WaterfallSpec, failAction: validationError },
    response: { schema: WaterfallSpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
        if (!waterfall) {
          return Boom.notFound("No Waterfall with this id");
        }
        await db.waterfallStore.deleteWaterfallById(waterfall._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Waterfall with this id");
      }
    },
    tags: ["api"],
    description: "Delete a waterfall",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.waterfallStore.deleteAllWaterfalls();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all WaterfallApi",
  },

  update: {
    auth: { strategy: "jwt" },
    validate: {
      params: { id: IdSpec },
      failAction: validationError,
    },
    handler: async function (request, h) {
      try {
        const waterfallId = request.params.id;

        const existing = await db.waterfallStore.getWaterfallById(waterfallId);
        if (!existing) {
          return Boom.notFound("No Waterfall with this id");
        }

        // Reference:
        // https://joi.dev/api/18.x.x
        const { error } = WaterfallSpecPlus.validate(request.payload);
        if(error){
          return Boom.badRequest(error.message);
        }

        const updatedWaterfall = await db.waterfallStore.updateWaterfall(waterfallId, request.payload);

        if (!updatedWaterfall) {
          return Boom.badImplementation("Error updating waterfall");
        }

        return updatedWaterfall.toObject();
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Update a Waterfall",
    notes: "Updates an existing waterfall and returns the updated object",
    response: { schema: WaterfallSpecPlus, failAction: validationError },
  },
};
