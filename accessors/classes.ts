/**
 * A CRUD interface for the database's `classes` table.
 */

import connection = require('../dbConnection');
import Class = require('../interfaces/class');
import { ClassQueryMessage } from '../interfaces/messages';
import { ClassResult } from '../interfaces/sqlQueryResult';

const client = connection.client;


/**
 * Prettify a result from the server. Map the results to a standard format that can be sent 
 * back to the client.
 * 
 * @param result The result of the query, straight from the server.
 */
function prettifyClass(result: ClassResult | ClassResult[] | undefined): Class | Class[] | null {
    if (result === undefined) return null;  // If there were no matching results
    if (Array.isArray(result)) {  // If we're dealing with an array of results
        if (!result) return result;
        
        const prettified: Class[] = [];
        for (const res of result) {
            prettified.push(mapFields(res));
        }
        return prettified;
    }
    
    // Otherwise we're dealing with just one result
    return mapFields(result);
    
    /**
     * Maps a single class's fields to the format we want to return to the client.
     * @param classResult A single class as returned from the database.
     */
    function mapFields(classResult: ClassResult): Class {
        const prettified: Class = {
            course: {
                department: classResult.department,
                number: classResult.number,
            },
            professor: {
                firstName: classResult.first_name,
                lastName: classResult.last_name,
            },
            section: classResult.section,
            semester: classResult.semester,
        };
        
        return prettified;
    }
}


/**
 * Get a class and its corresponding information using its id.
 * 
 * @param id Corresponds to the `id` field in the `classes` table.
 */
function getClassById(id: string) {    
    if (!id) {
        throw Error('You must provide an id.');
    }
    
    return client.query(
        `SELECT
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
            class.id = $1;`,
        [id],
    )
        .then((result) => {
            return prettifyClass(result.rows[0]);
        });
}


/**
 * Search the classes with the given criteria.
 * 
 * @param searchQuery The original query from the client.
 */
function searchClasses(searchQuery: ClassQueryMessage) {
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
    
    // Deal with optional parameters
    if (searchQuery.professor) {
        // `.push()` returns the length of the array -- we'll use that to keep track of the parameter number
        sqlQuery += ' AND professor.last_name = $' + parameters.push(searchQuery.professor.lastName);
        
        if (searchQuery.professor.firstName) {
            sqlQuery += ' AND professor.first_name = $' + parameters.push(searchQuery.professor.firstName);
        }
    }
    
    if (searchQuery.section) sqlQuery += ' AND class.section = $' + parameters.push(searchQuery.section);
    if (searchQuery.semester) sqlQuery += ' AND class.semester = $' + parameters.push(searchQuery.semester);
    
    // Execute the query
    return client.query(sqlQuery, parameters)
        .then((result) => {
            return prettifyClass(result.rows);
        });
}


export {getClassById, searchClasses};
