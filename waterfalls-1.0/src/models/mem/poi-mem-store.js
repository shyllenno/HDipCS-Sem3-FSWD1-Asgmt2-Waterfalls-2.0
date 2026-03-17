// eslint-disable-next-line import/no-unresolved
import { v4 } from "uuid";

let POIs = [];

export const POIMemStore = {
  async getAllPOIs() {
    return POIs;
  },

  async addPOI(waterfallId, POI) {
    POI._id = v4();
    POI.waterfallid = waterfallId;
    POIs.push(POI);
    return POI;
  },

  async getPOIsByWaterfallId(id) {
    let foundPOIs = POIs.filter((POI) => POI.waterfallid === id);
    if (foundPOIs === undefined) foundPOIs = null;
    return foundPOIs;
  },

  async getPOIById(id) {
    let foundPOI = POIs.find((POI) => POI._id === id);
    if (foundPOI === undefined) foundPOI = null;
    return foundPOI;
  },

  async deletePOIById(id) {
    const index = POIs.findIndex((POI) => POI._id === id);
    if (index !== -1) {
      POIs.splice(index, 1);
    }
  },

  async deleteAllPOIs() {
    POIs = [];
  },

  async updatePOI(POI, updatedPOI) {
    POI.name = updatedPOI.name;
    POI.description = updatedPOI.description;
    POI.latitude = updatedPOI.latitude;
    POI.longitude = updatedPOI.longitude;
  },
};
