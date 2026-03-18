import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const POIApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const POIs = await db.POIStore.getAllPOIs();
        return POIs;
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
  },

  findOne: {
    auth: false,
    async handler(request) {
      try {
        const POI = await db.POIStore.getPOIById(request.params.id);
        if (!POI) {
          return Boom.notFound("No POI with this id");
        }
        return POI;
      } catch (err) {
        return Boom.serverUnavailable("No POI with this id:", err);
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const POI = await db.POIStore.addPOI(request.params.id, request.payload);
        if (POI) {
          return h.response(POI).code(201);
        }
        return Boom.badImplementation("error creating POI");
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.POIStore.deleteAllPOIs();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const POI = await db.POIStore.getPOIById(request.params.id);
        if (!POI) {
          return Boom.notFound("No POI with this id");
        }
        await db.POIStore.deletePOI(POI._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Track with this id:", err);
      }
    },
  },
};