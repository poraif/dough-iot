import {
  getLatestTempAverage,
  getNumFeeds,
  getTimeToRipen,
} from "../models/firebase-config.js";

export const dashboardController = {
  async index(request, response) {
    try {
      const averageTemp = await getLatestTempAverage();
      const ripenTimes = await getTimeToRipen();
      const numFeeds = await getNumFeeds();

      const viewData = {
        title: "Dough IoT Dashboard",
        averageTemp: averageTemp.toFixed(2),
        numFeeds: numFeeds,
        latestRipenTime: "n/a",
        secondRipenTime: "n/a",
        thirdRipenTime: "n/a",
      };

      //conditionals mean those values aren't assigned 'undefined' before a feed cycle completes
      //undefined generates errors when used with toFixed method
      if (ripenTimes.length > 0) {
        viewData.latestRipenTime = ripenTimes.pop().toFixed(1);
      }

      if (ripenTimes.length > 1) {
        viewData.secondRipenTime = ripenTimes[ripenTimes.length - 2].toFixed(1);
      }

      if (ripenTimes.length > 2) {
        viewData.thirdRipenTime = ripenTimes[ripenTimes.length - 3].toFixed(1);
      }

      console.log("dashboard rendering");
      
      //data sent to console for error checking
      console.log(
        "avg:" + averageTemp,
        "feeds:" + numFeeds,
        "ripen1:" + viewData.latestRipenTime,
        "ripen2:" + viewData.secondRipenTime,
        "ripen3:" + viewData.thirdRipenTime
      );
      response.render("dashboard-view", viewData);
  
    } catch (error) {
      console.error("Error in dashboardController:", error);
      response.status(500).send("Internal Server Error");
    }
  },
};
