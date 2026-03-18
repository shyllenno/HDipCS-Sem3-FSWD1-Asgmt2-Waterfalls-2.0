import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const waterfallApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const waterfalls = await db.waterfallStore.getAllWaterfalls();
        return waterfalls;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },


  findOne: {
    auth: false,
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
  },

  create: {
    auth: false,
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
  },

  deleteOne: {
    auth: false,
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
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.waterfallStore.deleteAllWaterfalls();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};
