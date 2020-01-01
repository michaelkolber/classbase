/**
 * A CRUD interface for the database's `professors` table.
 */

import connection = require('../dbConnection');
import { ProfessorQueryMessage } from '../interfaces/messages';

const client = connection.client;


/**
 * Get a professor and its corresponding information using its id.
 * 
 * @param id Corresponds to the `id` field in the `professors` table.
 */
export async function getProfessorById(id: string) {
    const query = `
        SELECT
            first_name,
            last_name,
            id
        FROM
            professors
        WHERE
            id = $1;`;
    const parameters = [id];
    
    const result = await client.query(query, parameters);
    return result.rows[0];
}


/**
 * Search the professors with the given criteria.
 * 
 * @param searchQuery The original query from the client.
 */
export async function getProfessorsByCriteria(searchQuery: ProfessorQueryMessage) {
    // Build the query
    let sqlQuery = `SELECT
                        first_name,
                        last_name,
                        id
                    FROM
                        professors
                    WHERE
                        last_name = $1
                        `;
    const parameters = [searchQuery.lastName];  // The last name is required, so we know it will be in the search query.
    
    // Deal with optional parameters
    if (searchQuery.firstName) {
        sqlQuery += 'AND last_name = $2';
        parameters.push(searchQuery.firstName);
    }
    
    // Execute the query
    const result = await client.query(sqlQuery, parameters);                
    return result.rows;
}
