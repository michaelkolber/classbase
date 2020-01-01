import professorsAccessor = require('../accessors/professorsAccessor');
import helpers = require('../helpers/helpers');


/**
 * Get a professor and its corresponding information using its id.
 * 
 * @param id Corresponds to the `id` field in the `professors` table.
 */
export async function getProfessorById(id: string) {
    if (!id) {
        throw Error('You must provide an id.');
    }
    
    const result = await professorsAccessor.getProfessorById(id);
    return helpers.services.prettifyProfessorResult(result);
}
