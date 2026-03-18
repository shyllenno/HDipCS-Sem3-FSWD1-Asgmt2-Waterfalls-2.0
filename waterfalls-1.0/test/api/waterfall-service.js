import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const waterfallService = {
  waterfallUrl: serviceUrl,

  async createUser(user) {
    const response = await axios.post(`${this.waterfallUrl}/api/users`, user);
    return response.data;
  },

  async getUsers() {
    const response = await axios.get(`${this.waterfallUrl}/api/users`);
    return response.data;
  },

  async deleteAllUsers() {
    const response = await axios.delete(`${this.waterfallUrl}/api/users`);
    return response.data;
  },

  async getUser(id) {
    const response = await axios.get(`${this.waterfallUrl}/api/users/${id}`);
    return response.data;
  },

  async createWaterfall(waterfall) {
    const res = await axios.post(`${this.waterfallUrl}/api/waterfalls`, waterfall);
    return res.data;
  },

  async deleteAllWaterfalls() {
    const response = await axios.delete(`${this.waterfallUrl}/api/waterfalls`);
    return response.data;
  },

  async deleteWaterfall(id) {
    const response = await axios.delete(`${this.waterfallUrl}/api/waterfalls/${id}`);
    return response;
  },

  async getAllWaterfalls() {
    const res = await axios.get(`${this.waterfallUrl}/api/waterfalls`);
    return res.data;
  },

  async getWaterfall(id) {
    const res = await axios.get(`${this.waterfallUrl}/api/waterfalls/${id}`);
    return res.data;
  },

  
  


  async getAllPOIs() {
    const res = await axios.get(`${this.waterfallUrl}/api/pois`);
    return res.data;
  },

  async createPOI(id, POI) {
    const res = await axios.post(`${this.waterfallUrl}/api/waterfalls/${id}/pois`, POI);
    return res.data;
  },

  async deleteAllPOIs() {
    const res = await axios.delete(`${this.waterfallUrl}/api/pois`);
    return res.data;
  },

  async getPOI(id) {
    const res = await axios.get(`${this.waterfallUrl}/api/pois/${id}`);
    return res.data;
  },

  async deletePOI(id) {
    const res = await axios.delete(`${this.waterfallUrl}/api/pois/${id}`);
    return res.data;
  },

};