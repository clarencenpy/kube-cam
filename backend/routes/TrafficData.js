const express = require('express');
const LiveTrafficController = require('../controllers/LiveTrafficController');
const HistoricalTrafficController = require('../controllers/HistoricalTrafficController');

const trafficData = express.Router();
const liveTraffic = new LiveTrafficController();
const histTraffic = new HistoricalTrafficController();

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
    const sendResponse = function sendResponse(resp) {
      res.send(resp);
    };
    histTraffic.getTrafficDataByTimePeriod(start, end, sendResponse);
  }
  res.status(400);
  res.send({ message: 'Request needs start and end times.' });
});


module.exports = trafficData;
