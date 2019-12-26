/**
 * The router for `/classes`.
 * Allow for getting classes based on specific criteria.
 */

import express = require('express');
import classes = require('../accessors/classes');
import { createErrorMessage, createResultMessage, handleError } from '../helpers';

const router = express.Router();


router.route('/')
    // The catch-all.
    .all((req, res) => {
        const message = createErrorMessage("You must request a specific class with its ID, e.g. '/classes/1234'.");
        res.status(403).json(message);
    });


router.route('/:classId')
    // Handle getting of a specific class by its ID.
    .get((req, res) => {
        classes.getClassById(req.params.classId)
            .then((result) => { res.json(createResultMessage(result.rows[0])); })
            .catch((err) => { handleError(err, res); });
    });


export = router;
