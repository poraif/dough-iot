// import { readingStore } from "../models/readings-store.js";

export const dashboardController = {
  async index(request, response) {
    // readingStore.getRecentReadings((recentReadings) => {
    //   const latestTemp = recentReadings.length > 0 ? recentReadings[recentReadings.length - 1].temperature : null;

      const viewData = {
        title: "Dough IoT Dashboard",
        // latestTemp: latestTemp,
      };

      console.log("dashboard rendering");
      response.render("dashboard-view", viewData);
    // }); 
  },
};
