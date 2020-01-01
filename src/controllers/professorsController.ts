/**
 * A series of middlewares for `/classes`.
 */

import helpers = require('../helpers/helpers');
import professorsService = require('../services/professorsService');

import {Request, Response} from 'express';


/**
 * Deny access to the root path.
 */
export function denyRootPath(req: Request, res: Response) {
    helpers.controllers.sendErrorMessage(
        res,
        "You must request a specific professor with its ID, e.g. '/professors/1234'.",
        403);
}


/**
 * Get a single professor using its id.
 */
export async function getProfessorById(req: Request, res: Response) {
    try {
        const result = await professorsService.getProfessorById(req.params.professorId);
        res.json(helpers.controllers.craftResultMessage(result));
    } catch (err) {
        helpers.controllers.handleError(res, err);
    }
}
