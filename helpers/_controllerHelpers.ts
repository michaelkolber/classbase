import {Response} from 'express';
import {ErrorMessage, ResultMessage} from '../interfaces/messages';



/**
 * Creates an error message JSON object that can be returned to the client.
 * @param reason The reason that the request failed.
 */
function _craftErrorMessage(reason: string) {
    const message: ErrorMessage = {
        ok: false,
        result: {
            reason,
        },
    };
    
    return message;
}


/**
 * Sends a custom error message to the client.
 * @param res The request's `Response` object.
 * @param reason The reason that the request failed.
 * @param statusCode The HTTP status code to use when responding.
 */
export function sendErrorMessage(res: Response, reason: string, statusCode: number = 500) {
    const message = _craftErrorMessage(reason);
    res.status(statusCode).send(message);
}


/**
 * Sends a response back to the client with the detais of the error.
 * @param err The error that occurred.
 * @param res The request's `Response` object.
 */
export function handleError(res: Response, err: Error) {
    sendErrorMessage(res, 'An error occurred:\n' + err, 500);
}


/**
 * Creates a result message JSON object that can be returned to the client.
 * @param result The requested data.
 */
export function craftResultMessage(result: any) {
    if (result === undefined) result = null; // To make sure we always send a result
    
    const message: ResultMessage = {
        ok: true,
        result,
    };
    
    return message;
}
