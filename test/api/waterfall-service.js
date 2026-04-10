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
    const response = await axios.post(`${this.waterfallUrl}/api/waterfalls`, waterfall);
    return response.data;
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
    const response = await axios.get(`${this.waterfallUrl}/api/waterfalls`);
    return response.data;
  },

  async getWaterfall(id) {
    const response = await axios.get(`${this.waterfallUrl}/api/waterfalls/${id}`);
    return response.data;
  },

  async getAllPOIs() {
    const response = await axios.get(`${this.waterfallUrl}/api/pois`);
    return response.data;
  },

  async createPOI(id, POI) {
    const response = await axios.post(`${this.waterfallUrl}/api/waterfalls/${id}/pois`, POI);
    return response.data;
  },

  async deleteAllPOIs() {
    const response = await axios.delete(`${this.waterfallUrl}/api/pois`);
    return response.data;
  },

  async getPOI(id) {
    const response = await axios.get(`${this.waterfallUrl}/api/pois/${id}`);
    return response.data;
  },

  async deletePOI(id) {
    const response = await axios.delete(`${this.waterfallUrl}/api/pois/${id}`);
    return response.data;
  },

  async authenticate(user) {
    const response = await axios.post(`${this.waterfallUrl}/api/users/authenticate`, user);
    // eslint-disable-next-line dot-notation
    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    return response.data;
  },

  async clearAuth() {
    // eslint-disable-next-line dot-notation
    axios.defaults.headers.common["Authorization"] = "";
  },

  async updateWaterfall(id, updatedFields) {
    const response = await axios.put(`${this.waterfallUrl}/api/waterfalls/${id}`, updatedFields);
    return response.data;
  },

  async updatePOI(id, updatedFields) {
    const response = await axios.put(`${this.waterfallUrl}/api/pois/${id}`, updatedFields);
    return response.data;
  },
};
