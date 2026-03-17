// eslint-disable-next-line import/no-unresolved
import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const POIJsonStore = {
  async getAllPOIs() {
    await db.read();
    return db.data.POIs;
  },

  async addPOI(waterfallId, POI) {
    await db.read();
    POI._id = v4();
    POI.waterfallid = waterfallId;
    db.data.POIs.push(POI);
    await db.write();
    return POI;
  },

  async getPOIsByWaterfallId(id) {
    await db.read();
    return db.data.POIs.filter((POI) => POI.waterfallid === id);
  },

  async getPOIById(id) {
    await db.read();
    return db.data.POIs.find((POI) => POI._id === id);
  },

  async deletePOI(id) {
    await db.read();
    const index = db.data.POIs.findIndex((POI) => POI._id === id);
    db.data.POIs.splice(index, 1);
    await db.write();
  },

  async deleteAllPOIs() {
    db.data.POIs = [];
    await db.write();
  },

  async updatePOI(POI, updatedPOI) {
    POI.name = updatedPOI.name;
    POI.description = updatedPOI.description;
    POI.xCoordinate = updatedPOI.xCoordinate;
    POI.yCoordinate = updatedPOI.yCoordinate;
    await db.write();
  },
};
