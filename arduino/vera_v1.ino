/* * * * * * * * * * * * * * * * * * 
 *  Vera: Brewing over the air.
 * 
 * Author:  Tyler Petresky
 * Email:   hello@tylerpetresky.com
 * Date:    January 2016
 * * * * * * * * * * * * * * * * * */

#include <Adafruit_CC3000.h>
#include <CC3000_MDNS.h>
#include <aREST.h>

// Details for your WiFi network
#define WIFI_SSID    "Goatbucks Coffee"
#define WIFI_PASS    "treskypot"
#define WIFI_SECU     WLAN_SEC_WPA2

const short LISTEN_PORT = 80;

// Wifi module instance
Adafruit_CC3000 wifi_mod = Adafruit_CC3000(10, 3, 5,
                                            SPI_CLOCK_DIV2);

// Instance for the rest server
Adafruit_CC3000_Server rest_server(LISTEN_PORT);

// DNS Server object
// Using this allows us to reference our
// pot by name as opposed to IP.
MDNSResponder dns_mod;
aREST rest = aREST();

const short connection_pin = 2;
const short error_pin = 4;
const short on_pin = 7;
const short off_pin = 8;

// Setup the coffee pots wifi settings
void setup() {
  Serial.begin(115200);

  // Setup the control pins for output
  pinMode(on_pin, OUTPUT);
  pinMode(off_pin, OUTPUT);
  pinMode(connection_pin, OUTPUT);
  pinMode(error_pin, OUTPUT);

  // Set our on and off pins to low
  // This prevents our coffee pot from
  // starting to brew when given power.
  digitalWrite(on_pin, LOW);
  digitalWrite(off_pin, LOW);
  
  // Register our pressbutton function
  // with the REST server.
  rest.function("pressbutton", pressbutton);

  // Give our coffee pot a name and an ID. This
  // is used to refer to it from the NodeJS server.
  rest.set_id("001");
  rest.set_name("vera");

  digitalWrite(error_pin, HIGH);

  // Start the WiFi module
  Serial.println(F("Starting wireless communication"));
  if (!wifi_mod.begin())
    panic();

  // Connect to the Access Point defined above.
  if (!wifi_mod.connectToAP(WIFI_SSID, WIFI_PASS, WIFI_SECU))
    panic();

  // Request an IP address from the router.
  while (!wifi_mod.checkDHCP())
    delay(150);

  // Broadcast your IP as a name to other devices
  // on the network. Now, this pot can be accessed
  // at 'very.local' instead of '192.x.y.z'.
  if (!dns_mod.begin("vera", wifi_mod))
    panic();

  rest_server.begin();

  digitalWrite(error_pin, LOW);
  digitalWrite(connection_pin, HIGH);

  Serial.println(F("Successfully connected"));
}

void loop()
{
  // Check for any new client requests and "handle" them.
  dns_mod.update();

  Adafruit_CC3000_ClientRef client = rest_server.available();

  rest.handle(client);
}

// Simple program to "shut everything down" if an error
// occurs. Doesn't really do much except halt execution.
void panic()
{
  digitalWrite(error_pin, HIGH);
  while (1);
}

// The PressButton function we registered with
// out REST server. This function will be 'called'
// by the Node server and simulates a button press.
int pressbutton(String _command)
{
  // The command refers to the pin on the Arduino
  // to set to high. In my electronics setup, I
  // had the Brew button on pin 7 and the Off button
  // on pin 8.
  int pin = _command.toInt();
  
  // Press button
  digitalWrite(pin, HIGH);
  Serial.println(F("Going low"));
  
  delay(250);
  
  // Release button
  Serial.println(F("Going high"));
  digitalWrite(pin, LOW);
  
  return 1;
}

