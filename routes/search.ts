/**
 * The router for `/search`.
 * Allow for getting classes or professors based on specific criteria.
 */

import express = require('express');
import connection = require('../dbConnection');
import { createErrorMessage, createResultMessage, handleError, sendErrorMessage } from '../helpers';
import Class = require('../interfaces/class');
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
            // Build the query
            let sqlQuery = `SELECT
                                 course.department,
                                 course.number,
                                 class.semester,
                                 class.section,
                                 professor.first_name,
                                 professor.last_name
                             FROM
                                 classes class
                             LEFT JOIN
                                 courses course ON class.course_id = course.id
                             LEFT JOIN
                                 professors professor ON class.professor_id = professor.id
                             WHERE
                                 course.department = $1
                                 AND course.number = $2
                                 `;
            const parameters = [searchQuery.course.department, searchQuery.course.number];  // These are required, so we know they'll be in the search query.
            
            if (searchQuery.professor) {
                // `.push()` returns the length of the array -- we'll use that to keep track of the parameter number
                sqlQuery += 'AND professor.last_name = $' + parameters.push(searchQuery.professor.lastName);
                
                if (searchQuery.professor.firstName) {
                    sqlQuery += 'AND professor.first_name = $' + parameters.push(searchQuery.professor.firstName);
                }
            }
            
            if (searchQuery.section) sqlQuery += 'AND class.section = $' + parameters.push(searchQuery.section);
            if (searchQuery.semester) sqlQuery += 'AND class.semester = $' + parameters.push(searchQuery.semester);
            
            
            client.query(sqlQuery, parameters)
                .then((result) => {
                    // We need to put this in a more user-friendly format
                    const classes: Class[] = [];
                    for (const row of result.rows) {
                        const classObj: Class = {
                            course: {
                                department: row.department,
                                number: row.number,
                            },
                            professor: {
                                firstName: row.first_name,
                                lastName: row.last_name,
                            },
                            section: row.section,
                            semester: row.semester,
                        };
                        classes.push(classObj);
                    }
                    
                    // Send the result to the user
                    res.json(createResultMessage(classes));
                })
                .catch((err) => {
                    handleError(err, res);
                });
        }
    })
    
    // Catch-all.
    .all((req, res) => {
        const message = createErrorMessage('You must use a POST request for this endpoint.');
        res.status(405).json(message);
    });


export = router;
