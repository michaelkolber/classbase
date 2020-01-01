/**
 * A CRUD interface for the database's `classes` table.
 */

import connection = require('../dbConnection');
import { ClassQueryMessage } from '../interfaces/messages';

const client = connection.client;



/**
 * Get a class and its corresponding information from the database, using its id.
 * 
 * @param id Corresponds to the `id` field in the `classes` table.
 */
export async function getClassById(id: string) {
    const query = `
        SELECT
            course.department,
            course.number,
            class.semester,
            class.section,
            class.id class_id,
            professor.first_name,
            professor.last_name,
            professor.id professor_id
        FROM
            classes class
        LEFT JOIN
            courses course ON class.course_id = course.id
        LEFT JOIN
            professors professor ON class.professor_id = professor.id
        WHERE
            class.id = $1;`;
    const parameters = [id];
    
    const result = await client.query(query, parameters);
    
    return result.rows[0];
}


/**
 * Get all classes with the given criteria from the database.
 * 
 * @param searchQuery The original query from the client.
 */
export async function getClassesByCriteria(searchQuery: ClassQueryMessage) {
    // Build the query
    let sqlQuery = `
        SELECT
            course.department,
            course.number,
            class.semester,
            class.section,
            class.id class_id,
            professor.first_name,
            professor.last_name,
            professor.id professor_id
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
    const result = await client.query(sqlQuery, parameters);
    return result.rows;
}
