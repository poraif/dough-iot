#include "Firebase_Arduino_WiFiNINA.h"
#include <WiFiNINA.h>
#include <Arduino_MKRIoTCarrier.h>
#include <ThingSpeak.h> 
#include "config.h"

unsigned long myChannelNumber = SECRET_CH_ID;
const char *myWriteAPIKey = SECRET_WRITE_APIKEY;
MKRIoTCarrier carrier;
char ssid[] = WIFI_NAME;        
char pass[] = WIFI_PASSWORD;    
int status = WL_IDLE_STATUS;            
int trigPin = 10;    // Trigger
int echoPin = 9;    // Echo
float duration;
float temperature;
float distance;
int reading = 0;
bool transmissionStarted = false;
bool transmissionStopped = false;

WiFiClient wifiClient;
FirebaseData fbdo;

void setupWiFi() {

  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // Don't continue
    while (true);
  }

  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    delay(INTERVAL);
  }
  // You're connected now, so print out the data:
  Serial.println("You're connected to the network");
}

//if starter has approx. doubled, transmission stopped until refed (as distance from sensor increased)
//when stops - sends value of 1 to Thingspeak to act as a boolean - switches on green indicator that starter ready
//reading value is reset so that next feed will start at 0 to aid analysing data in web app
void stopTransmission() {
  if (!transmissionStopped) {
    transmissionStarted = false;
    ThingSpeak.setField(3, 1);
    int x = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
    if (x == 200) {
      Serial.println("set ripeStarter to TRUE");
    } else {
      Serial.println("Problem updating channel. HTTP error code " + String(x));
    }
    transmissionStopped = true; 
    reading = 0;  }
}


void sendMessage() {
  String path = "/events";
  String jsonStr;
  Serial.println("Pushing json... ");

  jsonStr = "{\"event\":\"readings\",\"temperature\":" + String(temperature) + ",\"distance\":" + String(distance) + ",\"reading\":" + String(reading) + "}";
  Serial.println(jsonStr);

  if (Firebase.pushJSON(fbdo, path + "/readings", jsonStr)) {
    Serial.println("path: " + fbdo.dataPath());
  } else {
    Serial.println("error, " + fbdo.errorReason());
  }
  fbdo.clear();
}

void setup() {

  Serial.begin(9600);

  while (!Serial) {
    ; // 
  }
  setupWiFi();
  ThingSpeak.begin(wifiClient);
  carrier.begin();

  //Boilerplate utrasonic sensor code
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(DATABASE_URL, DATABASE_SECRET, WIFI_NAME, WIFI_PASSWORD);
  Firebase.reconnectWiFi(true);
}

void loop() {
  //more boilerplate ultrasonic sensor code
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  pinMode(echoPin, INPUT);
  duration = pulseIn(echoPin, HIGH);

  temperature = carrier.Env.readTemperature();

  //Measures time taken for ultrasonic output to return, calculating distance by speed of sound through air
  distance = (duration / 2) * 0.0343; 

  //5 calc'd by measuring distance of sensor from starter in container
  //This amount within margin of error to validate new feed has started 
  if (distance > 5) {
    transmissionStarted = true;
    transmissionStopped = false;
    ThingSpeak.setField(1, temperature);
    ThingSpeak.setField(2, distance);
    ThingSpeak.setField(3, 0);
    int x = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
    if (x == 200) {
      Serial.println("Channel update successful.");
    } else {
      Serial.println("Problem updating channel. HTTP error code " + String(x));
    }

    sendMessage();
    reading++;
    delay(INTERVAL);  // Delay for 15000 (thingspeak requirement)
  }

  //under 4cm distance and starter is sufficiently risen to use (i.e. ripe)
  if (distance <= 4) {
    stopTransmission();
  }
}
