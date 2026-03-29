import { db } from "../models/db.js";
import { POISpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";

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
        const waterfallid = request.params.id;
        const waterfall = await db.waterfallStore.getWaterfallById(waterfallid);
        return h.view("waterfall-view", { title: "Add POI error", waterfall: waterfall, errors: error.details, values: request.payload }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const waterfallid = request.params.id;

      const imageFile = request.payload.imagefile;
      let imageUrl = "";
      if (Object.keys(imageFile).length > 0) {
        imageUrl = await imageStore.uploadImage(imageFile);
      }

      const newPOI = {
        waterfallid: waterfallid,
        type: request.payload.type,
        description: request.payload.description,
        latitude: parseFloat(request.payload.latitude),
        longitude: parseFloat(request.payload.longitude),
        img: imageUrl,
      };
      await db.POIStore.addPOI(newPOI);
      return h.redirect(`/waterfall/${waterfallid}`);
    },
  },

  deletePOI: {
    handler: async function (request, h) {
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      await db.POIStore.deletePOIById(request.params.poiId);
      return h.redirect(`/waterfall/${waterfall._id}`);
    },
  },
};
