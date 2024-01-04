import { getLatestData } from '../models/firebase-config.js';

export const dashboardController = {
  async index(request, response) {
    try {
      const latestData = await getLatestData();

      const viewData = {
          temperature: latestData.temperature,
          distance: latestData.distance,
          reading: latestData.reading,
          transmission: latestData.transmission,
          timeElapsed: latestData.timeElapsed,
      };

      console.log('Dashboard Data:', viewData);
      response.render('dashboard-view', viewData);
      
    } catch (error) {
      console.error('Error in dashboardController:', error);
      response.status(500).send('Internal Server Error');
    }
  },
};
