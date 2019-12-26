/**
 * These interfaces represent messages between the client and the API server.
 */


/**
 * The basic interface for a message from the server.
 */
interface Message {
    ok: boolean;
    result: object;
}


/**
 * A message from the server where there was an issue processing the request.
 */
interface ErrorMessage extends Message {
    ok: false;
    result: {
        reason: string;
    };
}


/**
 * A message from the server where the request was processed successfully. Contains the 
 * requested results.
 */
interface ResultMessage extends Message {
    ok: true;
    result: {};
}


/**
 * A 'class' search query from the client.
 */
interface ClassQueryMessage {
    course: {
        department: string,
        number: string,
    };
    professor?: {
        firstName?: string,
        lastName: string,
    };
    section?: string;
    semester?: string;
    type: 'class';
}


/**
 * A 'professor' search query from the client.
 */
interface ProfessorQueryMessage {
    firstName?: string;
    lastName: string;
    type: 'professor';
}


/**
 * A general search query from the client.
 */
type QueryMessage = ClassQueryMessage | ProfessorQueryMessage;


export {ErrorMessage, ResultMessage, QueryMessage};
