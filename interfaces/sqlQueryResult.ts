/**
 * A collection of interfaces that represent the result of a query to the database.
 */


interface ClassResult {
    department: string;
    number: string;
    section: string;
    semester: string;
    first_name: string;
    last_name: string;
}


interface ProfessorResult {
    first_name: string;
    last_name: string;
}


export {ClassResult, ProfessorResult};
