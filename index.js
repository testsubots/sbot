'use strict';
var request = require('request');
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());

app.listen(process.env.PORT || 8080, () => {
  console.log('sbot webhook is listening')
});

// // Creates the endpoint for our webhook 
// app.post('/webhook', (req, res) => {  

//   let body = req.body;

//   // Checks this is an event from a page subscription
//   if (body.object === 'page') {

//     // Iterates over each entry - there may be multiple if batched
//     body.entry.forEach(function(entry) {

//       // Gets the message. entry.messaging is an array, but 
//       // will only ever contain one message, so we get index 0
//       let webhook_event = entry.messaging[0];
//       console.log(webhook_event);
//     });

//     // Returns a '200 OK' response to all requests
//     res.status(200).send('EVENT_RECEIVED');
//   } else {
//     // Returns a '404 Not Found' if event is not from a page subscription
//     res.sendStatus(404);
//   }

// });
let token = ""
// let token = "subotnew"

app.post('/webhook', (req, res) => {
  token = "EAAszq7UbuyYBAGaSYn8SK092ZCGSoRvhKtQvsFtTDOcEABwFv5T1VsatCbwWBo9WBTHfOMNwag5Wlrbd6qSq9PZABmb4AYR6E5jx7Bt9VHcSdrU7g8dzVOkUFjmqARYxQ9EjZCXdcueIZAeE3qFeDjQiVC6mVEz8m9OGsvQiexFSp1LTvoV6DjLZCRiDQwdAZD";
  console.log(token)
  let messaging_events = req.body.entry[0].messaging
  if (messaging_events !== undefined) {
    for (let i = 0; i < messaging_events.length; i++) {
      let event = messaging_events[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        sendText(sender, "Text echo: " + text.substring(0, 100))
      }
      res.sendStatus(200)
    }
  }else{
    console.log(JSON.stringify(req.body.entry[0].messaging))
    let event = messaging_events[0]
    let sender = event.sender.id
    sendText(sender, "Text echo: undifined")
  }
});
function sendText(sender, text) {
  let messageData = { text: text }
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token, token },
    method: "POST",
    json: {
      receipt: { id: sender },
      message: messageData
    }, function(error, response, body) {
      if (error) {
        console.log('Sending an error')
      } else if (response.body.error) {
        console.log("body error")
      }
    }
  })
}
app.get('/', function (req, res) {
  return res.send('Welcome to Intuit Webhooks Sample App');
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "50b0a8a5d38b4364d0933dfe8edff701"
  // let VERIFY_TOKEN = "EAAszq7UbuyYBAGaSYn8SK092ZCGSoRvhKtQvsFtTDOcEABwFv5T1VsatCbwWBo9WBTHfOMNwag5Wlrbd6qSq9PZABmb4AYR6E5jx7Bt9VHcSdrU7g8dzVOkUFjmqARYxQ9EjZCXdcueIZAeE3qFeDjQiVC6mVEz8m9OGsvQiexFSp1LTvoV6DjLZCRiDQwdAZD"


  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }


});
