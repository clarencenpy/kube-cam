const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Goodbye world!');
});

module.exports = router;
