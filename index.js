'use strict';

const twilio = require('twilio');
const config = require('./config.json');
const { Translate } = require('@google-cloud/translate');

const MessagingResponse = twilio.twiml.MessagingResponse;

const projectId = process.env.GCLOUD_PROJECT;
const region = 'us-central1';

exports.reply = (req, res) => {

  const response = new MessagingResponse();

  const text = req.body.Body;
  const targetLanguage = 'es';

  const translate = new Translate({
    projectId: projectId,
  });

  translate
    .translate(text, targetLanguage)
    .then(results => {
      const translation = results[0];

      console.log(`Text: ${req.body}`);
      console.log(`Translation: ${translation}`);
      
      response.message(translation);
      res
        .status(200)
        .type('text/xml')
        .end(response.toString());
    })
    .catch(err => {
      console.error('ERROR:', err);
      res
        .status(500)
        .end("Translation Error");
    });

};