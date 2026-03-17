// eslint-disable-next-line import/no-unresolved
import { v4 } from "uuid";
import { POIMemStore } from "./poi-mem-store.js";

let waterfalls = [];

export const waterfallMemStore = {

  async getUserWaterfalls(userid) {
    return waterfalls.filter((waterfall) => waterfall.userid === userid);
  },

  async getAllWaterfalls() {
    return waterfalls;
  },

  async addWaterfall(waterfall) {
    waterfall._id = v4();

    // Ensure coordinates exist, if not, default to 0
    waterfall.x = waterfall.x ?? 0;
    waterfall.y = waterfall.y ?? 0;

    waterfalls.push(waterfall);
    return waterfall;
  },

  async getWaterfallById(id) {
    const list = waterfalls.find((waterfall) => waterfall._id === id);
    if (list) {
      list.POIs = await POIMemStore.getPOIsByWaterfallId(list._id);
      return list;
    }
    return null;
  },

  async deleteWaterfallById(id) {
    const index = waterfalls.findIndex((waterfall) => waterfall._id === id);
    if (index !== -1) waterfalls.splice(index, 1);
  },

  async deleteAllWaterfalls() {
    waterfalls = [];
  },

  // Reusable update method: id, {field: value}
  async updateWaterfall(id, updatedFields) {
    const index = waterfalls.findIndex((w) => w._id === id);
    if (index === -1) return null;

    // Create a new updated object using spread
    const updated = {
      ...waterfalls[index],
      ...updatedFields,
    };

    waterfalls[index] = updated;
    return updated;
  },
};
