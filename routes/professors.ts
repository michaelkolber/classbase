/**
 * The router for `/professors`.
 * Allow for getting professors based on specific criteria.
 */

import express = require('express');
import professors = require('../accessors/professors');
import { createErrorMessage, createResultMessage, handleError } from '../helpers';

const router = express.Router();


router.route('/')
    // The catch-all.
    .all((req, res) => {
        const message = createErrorMessage("You must request a specific professor with its ID, e.g. '/professors/1234'.");
        res.status(403).json(message);
    });


router.route('/:professorId')
    // Handle getting of a specific professor by its ID.
    .get((req, res) => {
        professors.getProfessorById(req.params.professorId)
            .then((result) => { res.json(createResultMessage(result)); })
            .catch((err) => { handleError(err, res); });
    });


export = router;
