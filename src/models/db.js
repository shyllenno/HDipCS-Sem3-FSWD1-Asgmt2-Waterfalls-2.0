import { userMemStore } from "./mem/user-mem-store.js";
import { waterfallMemStore } from "./mem/waterfall-mem-store.js";
import { POIMemStore } from "./mem/poi-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";
import { waterfallJsonStore } from "./json/waterfall-json-store.js";
import { POIJsonStore } from "./json/poi-json-store.js";

import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { waterfallMongoStore } from "./mongo/waterfall-mongo-store.js";
import { poiMongoStore } from "./mongo/poi-mongo-store.js";
import { reviewMongoStore } from "./mongo/review-mongo-store.js";

export const db = {
  userStore: null,
  waterfallStore: null,
  POIStore: null,
  reviewStore: null,
  connection: null,

  async init(storeType) {
    switch (storeType) {
      case "mongo":
        this.userStore = userMongoStore;
        this.waterfallStore = waterfallMongoStore;
        this.POIStore = poiMongoStore;
        this.reviewStore = reviewMongoStore;
        this.connection = await connectMongo();
        break;
      case "json":
        this.userStore = userJsonStore;
        this.waterfallStore = waterfallJsonStore;
        this.POIStore = POIJsonStore;
        break;
      default:
        this.userStore = userMemStore;
        this.waterfallStore = waterfallMemStore;
        this.POIStore = POIMemStore;
    }
  },

  async close(){
    if (this.connection){
      await this.connection.close();
      this.connection = null;
    }
  },
};
