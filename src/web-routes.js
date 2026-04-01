import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { waterfallController } from "./controllers/waterfall-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/dashboard", config: dashboardController.index },

  {
    method: "POST",
    path: "/dashboard/addwaterfall",
    options: {
      payload: {
        output: "data",
        parse: true,
        multipart: true,
        maxBytes: 209715200,
      },
      handler: dashboardController.addWaterfall.handler,
    },
  },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/waterfall/{id}", config: waterfallController.index },
  {
    method: "POST",
    path: "/waterfall/{id}/addpoi",
    options: {
      payload: {
        output: "data",
        parse: true,
        multipart: true,
        maxBytes: 209715200,
      },
      handler: waterfallController.addPOI.handler,
    },
  },

  { method: "GET", path: "/dashboard/deletewaterfall/{id}", config: dashboardController.deleteWaterfall },
  { method: "GET", path: "/waterfall/{id}/deletepoi/{poiId}", config: waterfallController.deletePOI },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },

  { method: "GET", path: "/user-profile", config: accountsController.profile },
  { method: "POST", path: "/user-profile/update/{id}", config: accountsController.update },
];
