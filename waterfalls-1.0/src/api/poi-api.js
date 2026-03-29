import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, POISpec, POISpecPlus, POIArray } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const POIApi = {
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const POIs = await db.POIStore.getAllPOIs();
        return POIs;
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
    tags: ["api"],
    response: { schema: POIArray, failAction: validationError },
    description: "Get all POIApi",
    notes: "Returns all POIApi",
  },

  findOne: {
    auth: { strategy: "jwt" },
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
    tags: ["api"],
    description: "Find a POI",
    notes: "Returns a POI",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: POISpecPlus, failAction: validationError },
  },

  create: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const poiData = request.payload;
        // poiData.waterfallid = request.params.id;

        const poi = await db.POIStore.addPOI(poiData);
        if (poi) {
          return h.response(poi).code(201);
        }
        return Boom.badImplementation("error creating POI");
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
    tags: ["api"],
    description: "Create a POI",
    notes: "Returns the newly created POI",
    validate: { payload: POISpec },
    response: { schema: POISpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.POIStore.deleteAllPOIs();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
    tags: ["api"],
    description: "Delete all POIs",
  },

  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const POI = await db.POIStore.getPOIById(request.params.id);
        if (!POI) {
          return Boom.notFound("No POI with this id");
        }
        await db.POIStore.deletePOIById(POI._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No POI with this id:", err);
      }
    },
    tags: ["api"],
    description: "Delete a POI",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },
};
