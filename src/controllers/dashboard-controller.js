import { db } from "../models/db.js";
import { WaterfallSpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      let waterfalls;

      if (loggedInUser.role === "admin") {
        waterfalls = await db.waterfallStore.getAllWaterfalls();

        // References
        // https://stackoverflow.com/questions/9329446/loop-for-each-over-an-array-in-javascript
        // eslint-disable-next-line no-restricted-syntax
        for (const waterfall of waterfalls) {
          // eslint-disable-next-line no-await-in-loop
          const belongsTo = await db.userStore.getUserById(waterfall.userid);
          waterfall.userEmail = belongsTo.email;
          waterfall.firstName = belongsTo.firstName;
          waterfall.lastName = belongsTo.lastName;
        }
      } else {
        waterfalls = await db.waterfallStore.getUserWaterfalls(loggedInUser._id);
      }

      const viewData = {
        user: loggedInUser,
        title: "Waterfall Dashboard",
        waterfalls: waterfalls,
        searchMode: false,
        addressPath: "/dashboard",
        isAdmin: loggedInUser.role === "admin",
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

    payload: {
      output: "data",
      parse: true,
      multipart: true,
      maxBytes: 209715200,
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
        imagefile: imageUrl,
        POIvisibility: request.payload.POIvisibility,
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

  editWaterfall: {
    handler: async function (request, h) {
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      const viewData = {
        isWaterfall: true,
        title: "Edit Waterfall",
        waterfall: waterfall,
      };
      return h.view("edit-view", viewData);
    },
  },

  updateWaterfall: {
    validate: {
      payload: WaterfallSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);

        return h
          .view("edit-view", {
            isWaterfall: true,
            title: "Update Waterfall Error",
            waterfall: waterfall,
            errors: error.details,
            values: request.payload,
          })
          .takeover()
          .code(400);
      },
    },

    payload: {
      multipart: true,
      output: "data",
      parse: true,
      maxBytes: 209715200,
    },

    handler: async function (request, h) {
      const waterfallId = request.params.id;
      const imageFile = request.payload.imagefile;
      let imageUrl;

      if (imageFile && Object.keys(imageFile).length > 0) {
        imageUrl = await imageStore.uploadImage(imageFile);
      }

      const updatedWaterfall = {
        name: request.payload.name,
        description: request.payload.description,
        latitude: parseFloat(request.payload.latitude),
        longitude: parseFloat(request.payload.longitude),
        imagefile: imageUrl,
      };

      await db.waterfallStore.updateWaterfall(waterfallId, updatedWaterfall);
      return h.redirect("/dashboard");
    },
  },

  searchWaterfalls: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      const query = request.query.question;
      const waterfalls = await db.waterfallStore.searchEverywhere(loggedInUser, query);

      return h.view("dashboard-view", {
        title: "Search Results",
        waterfalls: waterfalls,
        query: query,
        searchMode: true,
        addressPath: "/dashboard",
      });
    },
  },
};
