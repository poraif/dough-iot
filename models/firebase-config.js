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

const readingsRef = ref(db, 'readings');
const timeRef = ref(db, 'time');

let latestData = {
  temperature: null,
  distance: null,
};

export const getLatestData = () => {
  return new Promise((resolve) => {
    onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestReadingKey = Object.keys(data).pop();
        const latestReading = data[latestReadingKey];

        latestData = {
          temperature: latestReading.temperature,
          distance: latestReading.distance,
        };

        resolve(latestData);
      }
    });
  });
};

let latestTimeData = {
  timeElapsed: null,
};

export const getLatestTimeData = () => {
  return new Promise((resolve) => {
    onValue(timeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latestTimeKey = Object.keys(data).pop();
        const latestTime = data[latestTimeKey];

        latestTimeData = {
          timeElapsed: latestTime.timeElapsed,
        };

        resolve(latestTimeData);
      }
    });
  });
};
