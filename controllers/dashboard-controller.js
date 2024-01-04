import { getLatestData, getLatestTimeData } from '../models/firebase-config.js';

export const dashboardController = {
  async index(request, response) {
    try {
      const latestData = await getLatestData();
      const latestTimeData = await getLatestTimeData();

      const viewData = {
        title: 'Dough IoT Dashboard',
        temperature: latestData.temperature,
      };

      console.log('dashboard rendering');
      response.render('dashboard-view', viewData);
    } catch (error) {
      console.error('Error in dashboardController:', error);
      response.status(500).send('Internal Server Error');
    }
  },
};
