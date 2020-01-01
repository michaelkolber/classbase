import Class = require('../interfaces/Class');
import Professor = require('../interfaces/Professor');
import { ClassResult, ProfessorResult } from '../interfaces/sqlQueryResult';



/**
 * Prettify a result from the server. Map the results to a standard format that can be sent 
 * back to the client.
 * 
 * @param result The result of the query, straight from the server.
 */
export function prettifyClassResult(result: ClassResult | ClassResult[] | undefined): Class | Class[] | null {
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
                id: classResult.professor_id,
            },
            section: classResult.section,
            semester: classResult.semester,
            id: classResult.class_id,
        };
        
        return prettified;
    }
}


/**
 * Prettify a result from the server. Map the results to a standard format that can be sent 
 * back to the client.
 * 
 * @param result The result of the query, straight from the server.
 */
export function prettifyProfessorResult(result: ProfessorResult | ProfessorResult[] | undefined): Professor | Professor[] | null {
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
            id: professorResult.id,
        };
        
        return prettified;
    }
}
