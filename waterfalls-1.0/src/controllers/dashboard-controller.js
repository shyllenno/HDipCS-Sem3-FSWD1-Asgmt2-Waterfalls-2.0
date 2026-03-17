import { db } from "../models/db.js";

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
    handler: async function (request, h) {
      const loogedInUser = request.auth.credentials;
      const newWaterfall = {
        userid: loogedInUser._id,
        name: request.payload.name,
        description: request.payload.description,
        x: parseFloat(request.payload.x),
        y: parseFloat(request.payload.y),
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
