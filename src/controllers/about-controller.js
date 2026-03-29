export const aboutController = {
  index: {
    auth: false,
    handler: function (request, h) {
      const viewData = {
        title: "About Waterfall App",
      };
      return h.view("about-view", viewData);
    },
  },
};
