import { userMemStore } from "./mem/user-mem-store.js";
import { waterfallMemStore } from "./mem/waterfall-mem-store.js";
import { POIMemStore } from "./mem/poi-mem-store.js";

export const db = {
  userStore: null,
  waterfallStore: null,
  POIStore: null,

  init() {
    this.userStore = userMemStore;
    this.waterfallStore = waterfallMemStore;
    this.POIStore = POIMemStore;
  },
};
