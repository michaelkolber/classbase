/**
 * The interface for a Class JSON object that would be sent back to the client.
 */
interface Class {
    course: {
        department: string;
        number: string,
    };
    professor: {
        firstName: string,
        lastName: string,
    };
    section: string;
    semester: string;
}

export = Class;
