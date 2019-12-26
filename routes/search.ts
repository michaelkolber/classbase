/**
 * The router for `/search`.
 * Allow for getting classes or professors based on specific criteria.
 */

import express = require('express');
import { createErrorMessage, sendErrorMessage, handleError, createResultMessage } from '../helpers';
import { QueryMessage } from '../interfaces/message';
import searchFilter from '../interfaces/searchFilter';
import { Class } from '../models';

const router = express.Router();


/**
 * Validates an incoming search query from the client.
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
    
    if (!query.lastName) {
        sendErrorMessage(res, "Professor search queries must contain a valid 'lastName'.");
        return false;
    }
    return true;
}


router.route('/')
    .post((req, res) => {
        const query: QueryMessage = req.body;
        if (!isValidQuery(query, res)) return;
        
        if (query.type == 'class') {
            const filter: searchFilter = {course: query.course};
            if (query.professor) filter.professor = query.professor;
            if (query.section) filter.section = query.section;
            if (query.semester) filter.semester = query.semester;
            
            Class.find(filter).populate('professor').populate('course').exec((err, result) => {
                if (err) return handleError(err, res);
                createResultMessage(result);
            });
        }
    })
    
    .all((req, res) => {
        const message = createErrorMessage('You must use a POST request for this endpoint.');
        res.status(405).json(message);
    });


export = router;
