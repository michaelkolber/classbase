/**
 * A CRUD interface for the database's `professors` table.
 */

import connection = require('../dbConnection');
import Professor = require('../interfaces/professor');
import { ProfessorResult } from '../interfaces/sqlQueryResult';
import { ProfessorQueryMessage } from '../interfaces/messages';

const client = connection.client;


/**
 * Prettify a result from the server. Map the results to a standard format that can be sent 
 * back to the client.
 * 
 * @param result The result of the query, straight from the server.
 */
function prettifyProfessor(result: ProfessorResult | ProfessorResult[] | undefined): Professor | Professor[] | null {
    if (result === undefined) return null;  // If there were no matching results
    if (Array.isArray(result)) {  // If we're dealing with an array of results
        if (!result) return result;
        
        const prettified: Professor[] = [];
        for (const res of result) {
            prettified.push(mapFields(res));
        }
        return prettified;
    }
    
    // Otherwise we're dealing with just one result
    return mapFields(result);
    
    /**
     * Maps a single professor's fields to the format we want to return to the client.
     * @param professorResult A single professor as returned from the database.
     */
    function mapFields(professorResult: ProfessorResult): Professor {
        const prettified: Professor = {
            firstName: professorResult.first_name,
            lastName: professorResult.last_name,
        };
        
        return prettified;
    }
}


/**
 * Get a professor and its corresponding information using its id.
 * 
 * @param id Corresponds to the `id` field in the `professors` table.
 */
function getProfessorById(id: string) {    
    if (!id) {
        throw Error('You must provide an id.');
    }
    
    return client.query(
        `SELECT
            first_name,
            last_name
        FROM
            professors
        WHERE
            id = $1;`,
        [id],
    )
        .then((result) => {
            return prettifyProfessor(result.rows[0]);
        });
}


/**
 * Search the professors with the given criteria.
 * 
 * @param searchQuery The original query from the client.
 */
function searchProfessors(searchQuery: ProfessorQueryMessage) {
    // Build the query
    let sqlQuery = `SELECT
                        first_name,
                        last_name
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
    return client.query(sqlQuery, parameters)
        .then((result) => {                    
            return prettifyProfessor(result.rows);
        });
}


export {getProfessorById, searchProfessors};
