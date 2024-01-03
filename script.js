// Create database reference
const camRef = database.ref("events/button");

camRef.limitToLast(1).on("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    const event = childSnapshot.val()["event"];
    const temp = childSnapshot.val()["temperature"];
    const count = childSnapshot.val()["count"];
    document.getElementById("events").innerText += `Event: ${event}, Temp: ${temp}, Count: ${count} \n`
      })
  });
