import Professor from './Professor';

/**
 * The interface for a Class JSON object that would be sent back to the client.
 */
interface Class {
    course: {
        department: string;
        number: string,
    };
    professor: Professor;
    section: string;
    semester: string;
    id: number;
}

export = Class;
