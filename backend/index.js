const apiRoutes = require('./routes/RouteRules');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/kubecam/routerules', apiRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => console.log('Listening on port 3000!'));
