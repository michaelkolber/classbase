import express = require('express');

import {ErrorMessage, ResultMessage} from './interfaces/message';


/**
 * Sends a response back to the client with the detais of the error.
 * @param err The error that occurred.
 * @param res The request's `Response` object.
 */
function handleError(err, res: express.Response) {
    const message = createErrorMessage('An error occurred:\n' + err);
    
    res.status(500).json(message);
}


/**
 * Creates an error message JSON object that can be returned to the client.
 * @param reason The reason that the request failed.
 */
function createErrorMessage(reason: string) {
    const message: ErrorMessage = {
        ok: false,
        result: {
            reason,
        },
    };
    
    return message;
}


/**
 * Sends an error message to the client.
 * @param res The request's `Response` object.
 * @param reason The reason that the request failed.
 * @param statusCode The HTTP status code to use when responding.
 */
function sendErrorMessage(res: express.Response, reason: string, statusCode?: number) {
    if (statusCode) {
        res.status(statusCode);
    }
    
    const message = createErrorMessage(reason);
    
    res.send(message);
}


/**
 * Creates an error message JSON object that can be returned to the client.
 * @param reason The reason that the request failed.
 */
function createResultMessage(result: any) {
    const message: ResultMessage = {
        ok: true,
        result,
    };
    
    return message;
}


export {handleError, createErrorMessage, sendErrorMessage, createResultMessage};
