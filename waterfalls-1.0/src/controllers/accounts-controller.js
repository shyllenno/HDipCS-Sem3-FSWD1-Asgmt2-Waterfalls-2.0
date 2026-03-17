import { db } from "../models/db.js";
import { UserCredentialsSpec, UserSpec } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Waterfall App" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Waterfall App" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details, values: request.payload }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/login");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Waterfall App" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Login in error", errors: error.details, values: request.payload }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      // const user = await db.userStore.getUserByEmail(email);
      // if (!user || user.password !== password) {
      //   return h.redirect("/");
      // }

      // 1. Check if email exists
      const user = await db.userStore.getUserByEmail(email);
      if (!user) {
        return h
          .view("login-view", {
            title: "Login error",
            errors: [{ message: "Email not registered! Please sign up" }],
            values: request.payload,
          })
          .code(400);
      }

      // 2. Check password
      const passwordsMatch = user.password === password; // or bcrypt.compare()
      if (!passwordsMatch) {
        return h
          .view("login-view", {
            title: "Login error",
            errors: [{ message: "Incorrect password" }],
            values: request.payload,
          })
          .code(400);
      }

      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
