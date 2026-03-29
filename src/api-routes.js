import { userApi } from "./api/user-api.js";
import { waterfallApi } from "./api/waterfall-api.js";
import { POIApi } from "./api/poi-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  { method: "POST", path: "/api/waterfalls", config: waterfallApi.create },
  { method: "DELETE", path: "/api/waterfalls", config: waterfallApi.deleteAll },
  { method: "GET", path: "/api/waterfalls", config: waterfallApi.find },
  { method: "GET", path: "/api/waterfalls/{id}", config: waterfallApi.findOne },
  { method: "DELETE", path: "/api/waterfalls/{id}", config: waterfallApi.deleteOne },

  { method: "GET", path: "/api/pois", config: POIApi.find },
  { method: "GET", path: "/api/pois/{id}", config: POIApi.findOne },
  { method: "POST", path: "/api/waterfalls/{id}/pois", config: POIApi.create },
  { method: "DELETE", path: "/api/pois", config: POIApi.deleteAll },
  { method: "DELETE", path: "/api/pois/{id}", config: POIApi.deleteOne },

  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
];
