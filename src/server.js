import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Cookie from "@hapi/cookie";
import Handlebars from "handlebars";
import dotenv from "dotenv";
import Joi from "joi";
import path from "path";
import { fileURLToPath } from "url";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import jwt from "hapi-auth-jwt2";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { apiRoutes } from "./api-routes.js";
import { validate } from "./api/jwt-utils.js";

// Reference:
// https://hapi.dev/module/bell/api/13.x.x
// https://github.com/hapijs/bell/blob/master/examples/google.js

import Bell from "@hapi/bell";

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  // process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  info: {
    title: "Waterfalls-1.0 API Documentation",
    version: "0.1.0",
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [{ jwt: [] }],
};

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  });

  await server.register(Vision);
  await server.register(Bell);
  await server.register(Cookie);
  await server.register(Inert);
  await server.register({
    plugin: HapiSwagger,
    options: swaggerOptions,
  });
  await server.register(jwt);

  // References:
  // https://code-maven.com/handlebars-conditionals
  Handlebars.registerHelper("if_eq", (a, b) => a === b);
  Handlebars.registerHelper("or", (a, b) => a || b);
  Handlebars.registerHelper("and", (a, b) => a && b);
  Handlebars.registerHelper("not", (a) => !a);

  server.validator(Joi);

  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: 'cookie_encryption_password_secure',
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    isSecure: false,
    location: "http://localhost:3000"

  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo: "/login",
    validate: accountsController.validate,
  });

  server.auth.strategy("jwt", "jwt", {
    key: process.env.COOKIE_PASSWORD,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.default("session");

  server.views({
    engines: { hbs: Handlebars },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  db.init("mongo");

  server.route({
    method: ["GET", "POST"],
    path: "/auth/google",
    options: {
      auth: {
        strategy: "google",
        mode: "required"
      },

      handler: async function (request, h) {

        if (!request.auth.isAuthenticated) {
          return 'Authentication failed due to: ' + request.auth.error.message;
        }

        const profile = request.auth.credentials.profile;

        const email = profile.email;
        const firstName = profile.raw.given_name;
        const lastName = profile.raw.family_name;

        let user = await db.userStore.getUserByEmail(email);

        if (!user) {
          user = await db.userStore.addUser({
            firstName,
            lastName,
            email,
            password: null,
            role: "user"
          });
        }

        request.cookieAuth.set({ id: user._id });
        return h.redirect("/dashboard");
      }
    }
  });

  server.route(webRoutes);
  server.route(apiRoutes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
