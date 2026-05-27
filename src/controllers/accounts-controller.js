import { db } from "../models/db.js";
import { UserCredentialsSpec, UserSpec } from "../models/joi-schemas.js";

// Reference:
// https://github.com/apostrophecms/apostrophe/tree/main/packages/sanitize-html
import sanitizeHtml from 'sanitize-html';

// Reference:
// https://coreui.io/answers/how-to-hash-passwords-in-node-js/
import bcrypt from "bcrypt";

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
      const payloadUser = request.payload;

      const user = {
        firstName: sanitizeHtml(payloadUser.firstName),
        lastName: sanitizeHtml(payloadUser.lastName),
        email: payloadUser.email,
        password: await bcrypt.hash(payloadUser.password, 10),
        role: "user",
      }

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
      const passwordsMatch = await bcrypt.compare(password, user.password);
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
  profile: {
    auth: "session",
    handler: async function (request, h) {
      const userId = request.params.id;
      const user = await db.userStore.getUserById(userId);
      return h.view("user-profile-view", {
        title: "User Profile",
        user: user,
      });
    },
  },
  update: {
    auth: "session",
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const formData = request.payload;
        formData._id = request.auth.credentials._id;
        return h
          .view("user-profile-view", {
            title: "Update error",
            errors: error.details,
            user: formData,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      // eslint-disable-next-line prefer-destructuring
      const role = request.auth.credentials.role;
      const userId = request.params.id;
      const payloadUpdatedUser = request.payload;

      const updatedUser = {};

      if (payloadUpdatedUser.firstName){updatedUser.firstName = sanitizeHtml(payloadUpdatedUser.firstName);}
      if (payloadUpdatedUser.lastName){updatedUser.lastName = sanitizeHtml(payloadUpdatedUser.lastName);}
      if (payloadUpdatedUser.email){updatedUser.email = payloadUpdatedUser.email;}
      if (payloadUpdatedUser.password){updatedUser.password = await bcrypt.hash(payloadUpdatedUser.password, 10);}
      if (payloadUpdatedUser.role){updatedUser.role = payloadUpdatedUser.role;}


      await db.userStore.updateUser(userId, updatedUser);

      if (role === "admin") {
        return h.redirect("/admin");
      }
      return h.redirect(`/userprofile/${userId}?status=updatesuccessful`);
    },
  },
  delete: {
    auth: "session",
    handler: async function (request, h) {
      // eslint-disable-next-line prefer-destructuring
      const role = request.auth.credentials.role;
      const userId = request.params.id;
      await db.userStore.deleteUserById(userId);
      if (role === "admin") {
        return h.redirect("/admin");
      }
      request.cookieAuth.clear();
      return h.redirect("/?status=deletesuccessful");
    },
  },

  adminDashboard: {
    auth: "session",
    handler: async function (request, h) {
      const user = request.auth.credentials;

      if (user.role !== "admin") {
        return h.response("Access denied").code(403);
      }

      const users = await db.userStore.getAllUsers();

      return h.view("admin-dashboard-view", {
        title: "Admin Dashboard",
        admin: user,
        users: users,
      });
    },
  },
};
