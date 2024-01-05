
import { getLatestData, getLatestTempAverage, getNumFeeds, getTimeToRipen } from '../models/firebase-config.js';

export const dashboardController = {
  async index(request, response) {
    try {
      const latestData = await getLatestData();
      const averageTemp = await getLatestTempAverage();
      const ripenTime = await getTimeToRipen();
      const numFeeds = await getNumFeeds();

      const viewData = {
        title: 'Dough IoT Dashboard',
        temperature: latestData.temperature,
        averageTemp: averageTemp.toFixed(2),
        numFeeds: numFeeds,
        ripenTime: ripenTime.toFixed(1) 
      };


      console.log('dashboard rendering');
      console.log('data:' + viewData);
      response.render('dashboard-view', viewData);
    } catch (error) {
      console.error('Error in dashboardController:', error);
      response.status(500).send('Internal Server Error');
    }
  },
};