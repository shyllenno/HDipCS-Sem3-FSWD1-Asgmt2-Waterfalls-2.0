// eslint-disable-next-line import/no-unresolved
import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { POIJsonStore } from "./poi-json-store.js";

export const waterfallJsonStore = {
  async getAllWaterfalls() {
    await db.read();
    return db.data.waterfalls;
  },

  async addWaterfall(waterfall) {
    await db.read();
    waterfall._id = v4();

    // Ensure coordinates exist, if not, default to 0
    waterfall.x = waterfall.x ?? 0;
    waterfall.y = waterfall.y ?? 0;

    waterfall.POIs = [];

    db.data.waterfalls.push(waterfall);
    await db.write();
    return waterfall;
  },

  async getWaterfallById(id) {
    await db.read();
    let list = db.data.waterfalls.find((waterfall) => waterfall._id === id);
    if (list) {
      list.POIs = await POIJsonStore.getPOIsByWaterfallId(list._id);
    } else {
      list = null;
    }
    return list;
  },

  async getUserWaterfalls(userid) {
    await db.read();
    return db.data.waterfalls.filter((waterfall) => waterfall.userid === userid);
  },

  async deleteWaterfallById(id) {
    await db.read();
    const index = db.data.waterfalls.findIndex((waterfall) => waterfall._id === id);
    if (index !== -1) db.data.waterfalls.splice(index, 1);
    await db.write();
  },

  async deleteAllWaterfalls() {
    db.data.waterfalls = [];
    await db.write();
  },
};
