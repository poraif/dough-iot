
import { getLatestData, getLatestTempAverage, getTimeToRipen } from '../models/firebase-config.js';

export const dashboardController = {
  async index(request, response) {
    try {
      const latestData = await getLatestData();
      const averageTemp = await getLatestTempAverage();
      const ripenTime = await getTimeToRipen();

      const viewData = {
        title: 'Dough IoT Dashboard',
        temperature: latestData.temperature,
        transmission: latestData.transmission,
        averageTemp: averageTemp.toFixed(2),
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