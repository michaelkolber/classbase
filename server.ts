import express = require('express');

import connector = require('./connector');

import { ErrorMessage } from './interfaces/message';

const app = express();
const port = process.env.PORT || 1900;

// Make sure JSON is parsed properly
app.use(express.json());

// Set up routes
const apiRouter = express.Router();
import { createErrorMessage } from './helpers';
import classesRouter = require('./routes/classes');
import searchRouter = require('./routes/search');

apiRouter.use('/classes', classesRouter);
apiRouter.use('/search', searchRouter);
app.use('/api', apiRouter);


// Exists to make sure the API is up.
app.get('/', (req, res) => {
    const message = createErrorMessage("All requests must go through '/api'.");
    
    res.status(403).json(message);
});

// Establish a connection to the database
connector.connect(process.env.DB_URL, () => {
    // Start the server
    app.listen(port, () => console.log(`API server ready on port ${port}.`));
});

