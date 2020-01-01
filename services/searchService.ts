import classesAccessor = require('../accessors/classesAccessor');
import professorsAccessor = require('../accessors/professorsAccessor');
import helpers = require('../helpers/helpers');

import { ClassQueryMessage, ProfessorQueryMessage } from '../interfaces/messages';



/**
 * Get all classes with the given criteria.
 * 
 * @param searchQuery The original query from the client.
 */
export async function searchClasses(searchQuery: ClassQueryMessage) {
    const result = await classesAccessor.getClassesByCriteria(searchQuery);
    return helpers.services.prettifyClassResult(result);
}


/**
 * Get all professors with the given criteria.
 * 
 * @param searchQuery The original query from the client.
 */
export async function searchProfessors(searchQuery: ProfessorQueryMessage) {
    const result = await professorsAccessor.getProfessorsByCriteria(searchQuery);
    return helpers.services.prettifyProfessorResult(result);
}
