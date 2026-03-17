import { db } from "../models/db.js";

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
    handler: async function (request, h) {
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      const newPOI = {
        type: request.payload.type,
        description: request.payload.description,
        xCoordinate: parseFloat(request.payload.xCoordinate),
        yCoordinate: parseFloat(request.payload.yCoordinate),
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
