# Internet of Dough

A monitoring tool for optimising feeding schedules and conditions for your sourdough starter.
https://dough-iot.glitch.me/  
![sourdoughStarter](https://github.com/poraif/dough-iot/assets/80412354/651d38f8-4d9d-4be0-b7a6-b84e0bfbd112)

 
## Introduction
Sourdough bread baking requires the preparation of a starter, made up of flour, water and yeast. To get the best flavour and rise in for your dough, the starter must be kept in ideal conditions and fed at a regular schedule. 
This sensor kit and accompanying web app allows users to effectively monitor their starters without constant check-ups.

## Key features
1.	Temperature sensor detects temperature drops and notifies user to move the starter to a warmer spot.
2.	Ultrasonic sensors - detect the rise in the sourdough starter over time. When the starter has doubled in height, the user is notified.
3.	Web dashboard provides - avg temp during last feed, ripening times (based on time for starter to double in height), and count of number of feeds
4.	ThingSpeak widgets showing real-time readings, and with an indicator to display when starter is ready to use.
5.	Various metrics around the readings - including average temperature, and time taken for starter to double.
6.	Readings automatically stop when starter is ready.
   
## Technologies
-	Arduino IDE
-	Node.js – Express framework with Handlebars templating language (built using Glitch)
-	Thingspeak – handles HTTP posts from sensors
-	IFTTT - push notifications via HTTP request. 
-	Firebase Realtime Database
-	Arduino IoT Starter kit (using MKR1010 board)
-	HC-SR04 Ultrasonic sensor
•	Mobile device to receive push notifications

## Installation
Please find below a comprehensive guide to setting up the sensor kit and accompanying software.
[DoughIoT_SetupGuide.pdf](https://github.com/poraif/dough-iot/files/13846052/DoughIoT_SetupGuide.pdf)
