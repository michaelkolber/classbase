import classesAccessor = require('../accessors/classesAccessor');
import helpers = require('../helpers/helpers');


/**
 * Get a class and its corresponding information using its id.
 * 
 * @param id Corresponds to the `id` field in the `classes` table.
 */
export async function getClassById(id: string) {    
    if (!id) {
        throw Error('You must provide an id.');
    }
    
    const result = await classesAccessor.getClassById(id);
    return helpers.services.prettifyClassResult(result);
}
