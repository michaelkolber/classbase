/**
 * The router for `/search`.
 * Allow for getting classes or professors based on specific criteria.
 */

import express = require('express');
import { searchClasses } from '../accessors/classes';
import { searchProfessors } from '../accessors/professors';
import connection = require('../dbConnection');
import { createErrorMessage, createResultMessage, handleError, sendErrorMessage } from '../helpers';
import { QueryMessage } from '../interfaces/messages';

const client = connection.client;
const router = express.Router();


/**
 * Validates an incoming search query from the client.
 * 
 * @param query The search query from the client.
 * @param res The request's `Response` object.
 */
function isValidQuery(query: QueryMessage, res: express.Response) {
    if (!query.type || (query.type != 'class' && query.type != 'professor')) {
        sendErrorMessage(res, "Search query must contain a 'type': 'class' or 'professor'.");
        return false;
    }
    
    if (query.type == 'class') {
        if (!(query.course && query.course.department && query.course.number)) {
            sendErrorMessage(res, "Class search queries must contain a valid 'course' object, consisting of a 'department' and a 'number'.");
            return false;
        }
        return true;
    }
    
    // If it's not a class, it must be a professor
    if (!query.lastName) {
        sendErrorMessage(res, "Professor search queries must contain a valid 'lastName'.");
        return false;
    }
    return true;
}


router.route('/')
    // Search for classes or professors that meet the given criteria.
    .post((req, res) => {
        const searchQuery: QueryMessage = req.body;
        if (!isValidQuery(searchQuery, res)) return;
        
        if (searchQuery.type == 'class') {
            searchClasses(searchQuery)
                .then((result) => {
                    res.json(createResultMessage(result));
                })
                .catch((err) => {
                    handleError(err, res);
                });
            return;
        }
        
        // Otherwise the query is for a professor
        searchProfessors(searchQuery)
            .then((result) => {
                res.json(createResultMessage(result);
            })
            .catch((err) => {
                handleError(err, res);
            });
    })
    
    // Catch-all.
    .all((req, res) => {
        const message = createErrorMessage('You must use a POST request for this endpoint.');
        res.status(405).json(message);
    });


export = router;
