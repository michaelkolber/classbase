/**
 * A collection of interfaces that represent the result of a query to the database.
 */


export interface ClassResult {
    department: string;
    number: string;
    section: string;
    semester: string;
    class_id: number;
    first_name: string;
    last_name: string;
    professor_id: number;
}


export interface ProfessorResult {
    first_name: string;
    last_name: string;
    id: number;
}
