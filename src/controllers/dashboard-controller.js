import { db } from "../models/db.js";
import { WaterfallSpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const waterfalls = await db.waterfallStore.getUserWaterfalls(loggedInUser._id);
      const viewData = {
        user: loggedInUser,
        title: "Waterfall Dashboard",
        waterfalls: waterfalls,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addWaterfall: {
    validate: {
      payload: WaterfallSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Add Waterfall error", errors: error.details, values: request.payload }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loogedInUser = request.auth.credentials;

      const imageFile = request.payload.imagefile;
      let imageUrl = "";
      if (Object.keys(imageFile).length > 0) {
        imageUrl = await imageStore.uploadImage(imageFile);
      }

      const newWaterfall = {
        userid: loogedInUser._id,
        name: request.payload.name,
        description: request.payload.description,
        latitude: parseFloat(request.payload.latitude),
        longitude: parseFloat(request.payload.longitude),
        img: imageUrl,
      };
      await db.waterfallStore.addWaterfall(newWaterfall);
      return h.redirect("/dashboard");
    },
  },

  deleteWaterfall: {
    handler: async function (request, h) {
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      await db.waterfallStore.deleteWaterfallById(waterfall._id);
      return h.redirect("/dashboard");
    },
  },
};
