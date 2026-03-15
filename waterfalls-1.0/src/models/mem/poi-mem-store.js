// eslint-disable-next-line import/no-unresolved
import { v4 } from "uuid";

let POIs = [];

export const POIMemStore = {
  async getAllPOIs() {
    return POIs;
  },

  async addPOI(waterfallId, poi) {
    poi._id = v4();
    poi.waterfallid = waterfallId;
    POIs.push(poi);
    return poi;
  },

  async getPOIsByWaterfallId(id) {
    return POIs.filter((poi) => poi.waterfallid === id);
  },

  async getPOIById(id) {
    return POIs.find((poi) => poi._id === id);
  },

  async getWaterfallPOIs(waterfallId) {
    return POIs.filter((poi) => poi.waterfallid === waterfallId);
  },

  async deletePOI(id) {
    const index = POIs.findIndex((poi) => poi._id === id);
    POIs.splice(index, 1);
  },

  async deleteAllPOIs() {
    POIs = [];
  },

  async updatePOI(poi, updatedPOI) {
    poi.name = updatedPOI.name;
    poi.description = updatedPOI.description;
    poi.xCoordinate = updatedPOI.xCoordinate;
    poi.yCoordinate = updatedPOI.yCoordinate;
  },
};
