import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.fbAPI,
  authDomain: process.env.fbAuthDomain,
  databaseURL: process.env.FBDBURL,
  projectId: process.env.fbProjectID,
  storageBucket: process.env.fbStorageBucket,
  messagingSenderId: process.env.fbmessagingSenderId,
  appId: process.env.fbID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const readingsRef = ref(db, 'events/readings');

let latestData = {
  temperature: null,
  distance: null,
  reading: null,
  transmission: null,
  timeElapsed: null
};

export const getLatestData = () => {
  return new Promise((resolve, reject) => {
    onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestReadingKey = Object.keys(data).pop();
        const latestReading = data[latestReadingKey];

        const latestData = {
          temperature: latestReading.temperature,
          distance: latestReading.distance,
          reading: latestReading.reading,
          transmission: latestReading.transmission,
          timeElapsed: latestReading.timeElapsed
        };

        resolve(latestData);
      } else {
        reject(new Error('No data available'));
      }
    }, (error) => {
      reject(error);
    });
  });
};

export const getLatestTempAverage = () => {
  return new Promise((resolve, reject) => {
    onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        reject(new Error('No data available'));
        return;
      }

      const readings = Object.values(data);

      let currentTransmission = null;
      let consecutiveReadings = [];
      let averageTemperature = 0;

      readings.forEach(({ transmission, temperature }) => {
        if (transmission === currentTransmission || currentTransmission === null) {
          consecutiveReadings.push(temperature);
        } else {
          if (consecutiveReadings.length > 0) {
            const averageTemperature =
              consecutiveReadings.reduce((sum, temp) => sum + temp, 0) / consecutiveReadings.length;
            resolve(averageTemperature);
            return;
          }
          currentTransmission = transmission;
          consecutiveReadings = [temperature];
        }
      });

      if (consecutiveReadings.length > 0) {
      averageTemperature = consecutiveReadings.reduce((sum, temp) => sum + temp, 0) / consecutiveReadings.length;
        resolve(averageTemperature);
      } else {
        reject(new Error('No data available'));
      }
    }, (error) => {
      reject(error);
    });
  });
};

export const getTimeToRipen = () => {
  return new Promise((resolve, reject) => {
    onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        reject(new Error('No data available'));
        return;
      }

      const readings = Object.values(data);

      let currentTransmission = null;
      let consecutiveTimes = [];
      let timeTaken = null;
      let ripenTime = 0;

      readings.forEach(({ transmission, timeElapsed }) => {
        if (transmission === currentTransmission || currentTransmission === null) {
          consecutiveTimes.push(timeElapsed);
        } else {
          if (consecutiveTimes.length >= 2) {
            let lastTime = consecutiveTimes.pop();
            let firstTime = consecutiveTimes.shift();
            timeTaken = lastTime - firstTime;
            ripenTime = timeTaken / 3600000;
            resolve(ripenTime);
          }
          consecutiveTimes = [timeElapsed];
        }
        currentTransmission = transmission;
      });

      if (consecutiveTimes.length >= 2) {
        let lastTime = consecutiveTimes.pop();
        let firstTime = consecutiveTimes.shift();
        timeTaken = lastTime - firstTime;
        ripenTime = timeTaken / 3600000;
        resolve(ripenTime);
      } else {
        reject(new Error('Insufficient data for calculating ripen time'));
      }
    }, (error) => {
      reject(error);
    });
  });
};
