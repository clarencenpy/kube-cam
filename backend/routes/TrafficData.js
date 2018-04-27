const express = require('express');
const LiveTrafficController = require('../controllers/LiveTrafficController');

const trafficData = express.Router();
const liveTraffic = new LiveTrafficController();

trafficData.get('/current', (req, res) => {
  const sendResponse = function sendResponse(resp) {
    res.send(resp);
  };
  liveTraffic.getCurrentTraffic(sendResponse);
});


trafficData.get('/', (req, res) => {
  const start = req.query.start.toString();
  const end = req.query.end.toString();
  if (start !== undefined && end !== undefined) {
    // do the live thing
    res.send('Hello');
  }
  // Invalid request
  res.status(400);
});


module.exports = trafficData;
