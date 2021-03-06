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
  token = "EAAszq7UbuyYBAPzx3VzSVLE2AnijQjg7g2rwzOKKv6By7I42NeGV5rYojQkI34iu7QMlf6PusTpdvb4KwRzpz97cRmTingY6U9A1foNZAqv9iaF6mULPS2pWH8P22KFN9qhXj1rZBy6ZCKXwe9syfnsuXz2DvRKjTzl05PmeLv8iXP3yXbP7Wx0L9PVsj4ZD";
  // console.log(token)
  // console.log(JSON.stringify(req.body.entry[0].messaging[3].message.text))


  let messaging_events = req.body.entry[0].messaging
  if (messaging_events !== undefined) {
    for (let i = 0; i < messaging_events.length; i++) {
      let event = messaging_events[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        let newtxt = messaging_events[messaging_events.length-1].message.text
      console.log(newtxt.substring(0, 100))

        sendText(sender, "Supun said that you say: " + text.substring(0, 100),token)
      }
      res.sendStatus(200)
    }
  }else{
    
    let event = messaging_events[0].messaging
    let sender = event.sender.id
    console.log('... is not defined')
    sendText(sender, "Supun says: undifined", token)
  }
});
function sendText(sender, text, token) {
  let messageData = { text: text }
  // console.log('token eka: '+token)
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token : token },
    method: "POST",
    json: {
      recipient: { id: sender },
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
  return res.send('Welcome to SuBot App');
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
