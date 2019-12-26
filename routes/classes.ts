/**
 * The router for `/classes`.
 * Allow for getting classes based on specific criteria.
 */

import express = require('express');
import classes = require('../accessors/classes');
import { createErrorMessage, createResultMessage, handleError } from '../helpers';

const router = express.Router();


router.route('/')
    .all((req, res) => {
        const message = createErrorMessage("You must request a specific class with its ID, e.g. '/classes/1234'.");
        res.status(403).json(message);
    });


router.route('/:classId')
    .get((req, res) => {
        classes.getClassById(req.params.classId, (err, result) => {
            if (err) return handleError(err, res);
            const message = createResultMessage(result);
            res.json(message);
        });
    });


export = router;
