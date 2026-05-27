import { db } from "../models/db.js";
import { POISpec, ReviewSpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";
import { POISchema } from "../models/mongo/mongoSchemas.js";

export const waterfallController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);

      const isOwner = waterfall.userid.toString() === loggedInUser._id.toString();
      waterfall.canModify = loggedInUser.role === "admin" || isOwner;

      let reviews = await db.reviewStore.getReviewsByWaterfallId(waterfall._id);
      reviews = reviews.map((review) => ({
        ...review,
        isOwner: review.userid._id.toString() === loggedInUser._id.toString(),
      }));

      const viewData = {
        title: "Waterfall",
        waterfall: waterfall,
        reviews: reviews,
        user: loggedInUser,
        addressPath: `/waterfall/${waterfall._id}`,
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

    payload: {
      output: "data",
      parse: true,
      multipart: true,
      maxBytes: 209715200,
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
        group: request.payload.group,
        description: request.payload.description,
        latitude: parseFloat(request.payload.latitude),
        longitude: parseFloat(request.payload.longitude),
        imagefile: imageUrl,
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

  viewPOI: {
    handler: async function (request, h) {
      const POI = await db.POIStore.getPOIById(request.params.poiId);
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      const viewData = {
        isPOI: true,
        title: "Edit POI",
        poi: POI,
        waterfall: waterfall,
      };
      return h.view("edit-view", viewData);
    },
  },

  updatePOI: {
    validate: {
      payload: POISpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
        const poi = await db.POIStore.getPOIById(request.params.poiId);

        return h
          .view("edit-view", {
            isPOI: true,
            title: "Update POI Error",
            waterfall: waterfall,
            poi: poi,
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
      const poiId = request.params.id;
      const imageFile = request.payload.imagefile;
      let imageUrl;

      if (imageFile && Object.keys(imageFile).length > 0) {
        imageUrl = await imageStore.uploadImage(imageFile);
      }

      const updatedPOI = {
        type: request.payload.type,
        group: request.payload.group,
        description: request.payload.description,
        latitude: parseFloat(request.payload.latitude),
        longitude: parseFloat(request.payload.longitude),
        imagefile: imageUrl,
      };

      await db.POIStore.updatePOI(poiId, updatedPOI);

      return h.redirect(`/waterfall/${request.params.id}`);
    },
  },

  searchPOIs: {
    handler: async function (request, h) {
      const waterfallId = request.params.id;

      const query = request.query.question;
      const POIs = await db.POIStore.searchEverywhere(waterfallId, query);

      return h.view("waterfall-view", {
        title: "Search Results",
        waterfall: {
          _id: waterfallId,
          POIs: POIs,
        },
        query: query,
        searchMode: true,
        addressPath: `/waterfall/${waterfallId}`
      });
    },
  },

  groupPOIs: {
    handler: async function (request, h) {
      const waterfall = await db.waterfallStore.getWaterfallById(request.params.id);
      const groupedPOIs = await db.POIStore.groupPOIsByCategory(request.params.id);

      return h.view("waterfall-group", {
        title: waterfall.name,
        waterfall: waterfall,
        groupedPOIs: groupedPOIs,
      });
    }
  },

  addReview: {

    validate: {
      payload: ReviewSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const waterfallid = request.params.id;
        const waterfall = await db.waterfallStore.getWaterfallById(waterfallid);
        const reviews = await db.reviewStore.getReviewsByWaterfallId(waterfallid);
        return h.view("waterfall-view", { title: "Add Review error", waterfall: waterfall, reviews: reviews, errors: error.details, values: request.payload }).takeover().code(400);
      },
    },

    handler: async function (request, h) {
      const newReview = {
        rating: request.payload.rating,
        comment: request.payload.comment,
        waterfallid: request.params.id,
        userid: request.auth.credentials._id,
      };

      await db.reviewStore.addReview(newReview);
      return h.redirect(`/waterfall/${request.params.id}`);
    }
  },

  deleteReview: {
    handler: async function (request, h) {
      const waterfallId = request.params.id;
      const reviewId = request.params.reviewId;

      await db.reviewStore.deleteReviewById(reviewId);

      return h.redirect(`/waterfall/${waterfallId}`);
    }
  }

};
