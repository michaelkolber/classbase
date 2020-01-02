/**
 * The web server that sits between the database and the client.
 * 
 * The server is an Express server. It communicates via JSON, exposing a RESTful API. It is 
 * reachable via the '/api' path.
 */

import express = require('express');
import dbConnection = require('./dbConnection');  // The connection lives here and is `require`ed whenever needed. Relies on Node's module caching.
import helpers = require('./helpers/helpers');

const app = express();
const port = process.env.PORT || 1900;


// Make sure JSON is parsed properly
app.use(express.json());


// Set up routes
const apiRouter = express.Router(); // Tie everything to this router so that we can run everything through '/api'
apiRouter.use('/classes', require('./routes/classes'));
apiRouter.use('/professors', require('./routes/professors'));
apiRouter.use('/search', require('./routes/search'));

app.use('/api', apiRouter);


// Catch-all. Also serves as an easy way to make sure the API is up.
app.all('/', (req, res) => {
    helpers.controllers.sendErrorMessage(
        res,
        "All requests must go through '/api'.",
        403);
});


// Start the server
app.listen(port, () => console.log(`API server ready on port ${port}.`));
