export const aboutController = {
  index(request, response) {
    const viewData = {
      title: "About Internet of Dough",
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};
