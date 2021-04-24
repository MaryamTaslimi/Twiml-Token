require('dotenv').config();
var express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const Twilio = require('twilio');

var app = express();
const port = process.env.PORT || 3000;

// routes will go here
app.get('/', function (req, res) {
  var To = req.param('To');
  var Room = req.param('Room');
  const twiml = new VoiceResponse();
  if (To && Room) {
    const attr = isAValidPhoneNumber(To) ? "number" : "client";
    const dial = twiml.dial();
    dial.conference(Room);
  } else {
    twiml.say("Hey Dude!");
  }
  res.type('text/xml');
  res.send(twiml.toString());
});

app.get('/token/', function (req, res) {
  const IDENTITY = req.param('Identity');
  const ACCOUNT_SID = process.env.ACCOUNT_SID;

  // set these values in your .env file
  const TWIML_APPLICATION_SID = process.env.TWIML_APPLICATION_SID;
  const API_KEY = process.env.API_KEY;
  const API_SECRET = process.env.API_SECRET;
  const AccessToken = Twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;
  
  const accessToken = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);
  accessToken.identity = IDENTITY;
  const grant = new VoiceGrant({
      outgoingApplicationSid: TWIML_APPLICATION_SID,
      incomingAllow: true
  });
  accessToken.addGrant(grant);

  res.type('application/json');
  res.send({
      identity: IDENTITY,
      token: accessToken.toJwt()
  });
});
// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);


/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}



