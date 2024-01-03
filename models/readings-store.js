
// const firebaseConfig = {
//   // Your Firebase configuration
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const database = getDatabase(firebaseApp);

// export const readingStore = {
//   async getRecentReadings(callback) {
//     try {
//       // Check if the database service is available
//       if (!database) {
//         throw new Error("Firebase database service is not available");
//       }

//       const camRef = ref(database, "events/button");
//       const snapshot = await get(limitToLast(camRef, 4));

//       const readings = [];
//       snapshot.forEach((childSnapshot) => {
//         const event = childSnapshot.val()["event"];
//         const temp = childSnapshot.val()["temperature"];
//         const count = childSnapshot.val()["count"];
//         readings.push({ event, temp, count });
//       });

//       callback(readings);
//     } catch (error) {
//       console.error("Error in getRecentReadings:", error.message);
//     }
//   }
// };
