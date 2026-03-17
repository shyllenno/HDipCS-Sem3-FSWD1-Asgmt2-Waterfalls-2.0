import { db } from "../models/db.js";
import { POISpec } from "../models/joi-schemas.js";

export const waterfallController = {
  index: {
    handler: async function (request, h) {
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      const viewData = {
        title: "Waterfall",
        waterfall: waterfall,
      };
      return h.view("waterfall-view", viewData);
    },
  },

  addPOI: {
    validate: {
      payload: POISpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const waterfallId = request.params.id;
        const waterfall = await db.waterfallStore.getWaterfallById(waterfallId);
        return h.view("waterfall-view", { title: "Add POI error", waterfall: waterfall, errors: error.details, values: request.payload }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      const newPOI = {
        waterfallId: waterfall._id,
        type: request.payload.type,
        description: request.payload.description,
        latitude: parseFloat(request.payload.latitude),
        longitude: parseFloat(request.payload.longitude),
      };
      await db.POIStore.addPOI(waterfall._id, newPOI);
      return h.redirect(`/waterfall/${waterfall._id}`);
    },
  },

  deletePOI: {
    handler: async function (request, h) {
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      await db.POIStore.deletePOI(request.params.poiId);
      return h.redirect(`/waterfall/${waterfall._id}`);
    },
  },
};
