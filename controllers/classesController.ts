/**
 * A series of middlewares for `/classes`.
 */

import helpers = require('../helpers/helpers');
import classesService = require('../services/classesService');

import {Request, Response} from 'express';


/**
 * Deny access to the root path.
 */
export function denyRootPath(req: Request, res: Response) {
    helpers.controllers.sendErrorMessage(
        res,
        "You must request a specific class with its ID, e.g. '/classes/1234'.",
        403);
}


/**
 * Get a single class using its id.
 */
export async function getClassById(req: Request, res: Response) {
    try {
        const result = await classesService.getClassById(req.params.classId);
        res.json(helpers.controllers.craftResultMessage(result));
    } catch (err) {
        helpers.controllers.handleError(res, err);
    }
}
