const express = require('express');
const apiRoutes = require('./routes/api.js');

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/kubecam/api', apiRoutes);

app.listen(3000, () => console.log('Listening on port 3000!'));
