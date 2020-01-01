/**
 * A series of middlewares for `/search`.
 */


import helpers = require('../helpers/helpers');
import searchService = require('../services/searchService');

import {Request, Response} from 'express';
import { QueryMessage } from '../interfaces/messages';
import { Middleware } from '../interfaces/Middleware';


/**
 * Validates an incoming search query from the client.
 * 
 * @param query The search query from the client.
 * @param res The request's `Response` object.
 */
function _isValidQuery(query: QueryMessage, res: Response) {
    if (!query.type || (query.type != 'class' && query.type != 'professor')) {
        helpers.controllers.sendErrorMessage(
            res,
            "Search query must contain a 'type': 'class' or 'professor'.",
            400);
        return false;
    }
    
    if (query.type == 'class') {
        if (!(query.course && query.course.department && query.course.number)) {
            helpers.controllers.sendErrorMessage(
                res,
                "Class search queries must contain a valid 'course' object, consisting of a 'department' and a 'number'.",
                400);
            return false;
        }
        return true;
    }
    
    // If it's not a class, it must be a professor
    if (!query.lastName) {
        helpers.controllers.sendErrorMessage(
            res,
            "Professor search queries must contain a valid 'lastName'.",
            400);
        return false;
    }
    return true;
}


/**
 * Only allow POST requests.
 */
export function requirePOST(req: Request, res: Response, next: Middleware) {
    if (req.method !== 'POST') {
        helpers.controllers.sendErrorMessage(
            res,
            'You must use a POST request for this endpoint.',
            405);
        return;
    }
    next();
}


/**
 * Search for classes or professors that meet the given criteria.
 */
export async function search(req: Request, res: Response) {
    const searchQuery: QueryMessage = req.body;
    if (!_isValidQuery(searchQuery, res)) return;
    
    try {
        let result;
        if (searchQuery.type == 'class') {
            result = await searchService.searchClasses(searchQuery);
        } else { // Otherwise the query is for a professor
            result = await searchService.searchProfessors(searchQuery);
        }
        
        res.json(helpers.controllers.craftResultMessage(result));
    } catch (err) {
        helpers.controllers.handleError(res, err);
    }
}
