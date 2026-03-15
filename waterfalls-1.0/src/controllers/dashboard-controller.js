import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const waterfalls = await db.waterfallStore.getAllWaterfalls();
      const viewData = {
        title: "Waterfall Dashboard",
        waterfalls: waterfalls,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addWaterfall: {
    handler: async function (request, h) {
      const newWaterfall = {
        name: request.payload.name,
        description: request.payload.description,
        x: parseFloat(request.payload.x),
        y: parseFloat(request.payload.y),
      };
      await db.waterfallStore.addWaterfall(newWaterfall);
      return h.redirect("/dashboard");
    },
  },
};
