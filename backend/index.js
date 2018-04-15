const express = require('express');
const apiRoutes = require('./routes/RouteRules');

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/kubecam/routerules', apiRoutes);

app.listen(3000, () => console.log('Listening on port 3000!'));
