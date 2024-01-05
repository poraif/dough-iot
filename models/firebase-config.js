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
          reading: latestReading.reading
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


//loops backwards through readings
//each feed starts readings at 0
//so first checks for existing 0 reading
// then, gets the average temp of readings from then to the prev. 0
//means only returns average when a full feed cycle complete
export const getLatestTempAverage = () => {
  return new Promise((resolve, reject) => {
    onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const readings = Object.values(data);
        let totalTemp = 0;
        let count = 0;
        let foundFirstReadingZero = false;

        for (let i = readings.length - 1; i >= 0; i--) {
          const currentReading = readings[i];

          if (currentReading.reading === 0) {
            if (foundFirstReadingZero) {
              // Stop the loop when the second reading is 0
              break;
            } else {
              foundFirstReadingZero = true;
              continue; // Skip the first reading equal to 0
            }
          }

          if (foundFirstReadingZero) {
            totalTemp += currentReading.temperature;
            count++;
          }
        }

        if (count > 1) {
          const averageTemperature = totalTemp / count;
          console.log('Average Temperature:', averageTemperature);
          resolve(averageTemperature);
        } else {
          console.log('Not enough readings.');
          resolve(0); // Resolve with null when there are not enough readings with reading=0
        }
      } else {
        console.log('No data found.');
        resolve(null); // Resolve with null when no data is present
      }
    }, (error) => {
      console.error('Error reading data:', error);
      reject(error);
    });
  });
};

//simple counter for reading=0
//includes first 0 because that will be a feed also
export const getNumFeeds = () => {
  return new Promise((resolve, reject) => {
    onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Assuming readings is an array obtained from data
        const readings = Object.values(data);
        let numFeeds = 0;
        
        readings.forEach(({ reading }) => {
          if (reading === 0) {
            numFeeds++;
          }
        });

        console.log('There have been ' + numFeeds + ' feeds');
        resolve(numFeeds); // Resolve the promise with the count
      } else {
        console.log('No data found.');
        resolve(0); // Resolve with 0 if no data is present
      }
    }, (error) => {
      console.error('Error reading data:', error);
      reject(error); // Reject the promise with the error
    });
  });
};

//returns time for starter to ripen based on counting readings returned between reading=0
//as reading=0 is only returned after transmission stops/starter ripened, that will give all the values for that feed cycle
//because there's fixed delay of readings of 15000 millis, can get the overall time from that
export const getTimeToRipen = () => {
  return new Promise((resolve, reject) => {
    onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const readings = Object.values(data);
        let delay = 15000;
        let count = 0;
        let foundFirstReadingZero = false;
        let timeMillis = null;
        let ripenTime = 0;

        for (let i = readings.length - 1; i >= 0; i--) {
          const currentReading = readings[i];

          if (currentReading.reading === 0) {
            if (foundFirstReadingZero) {
              // Stop the loop when the second reading is 0
              break;
            } else {
              foundFirstReadingZero = true;
              continue; // Skip the first reading equal to 0
            }
          }

          if (foundFirstReadingZero) {
            count++;
          }
        }

        if (count > 1) {
          timeMillis = count * delay;
          ripenTime = timeMillis / 3600000;
          resolve(ripenTime);
        } else {
          console.log('Not enough readings.');
          resolve(0);
        }
      } else {
        console.log('No data found.');
        resolve(0); //
      }
    }, (error) => {
      console.error('Error reading data:', error);
      reject(error);
    });
  });
};
