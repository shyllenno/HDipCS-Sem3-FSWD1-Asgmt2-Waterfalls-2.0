import { userMemStore } from "./mem/user-mem-store.js";
import { waterfallMemStore } from "./mem/waterfall-mem-store.js";
import { POIMemStore } from "./mem/poi-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";
import { waterfallJsonStore } from "./json/waterfall-json-store.js";
import { POIJsonStore } from "./json/poi-json-store.js";

export const db = {
  userStore: null,
  waterfallStore: null,
  POIStore: null,

  init(storeType) {
    switch (storeType) {
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
};
