interface ClassSearchFilter {
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
}

interface ProfessorSearchFilter {
    firstName?: string;
    lastName: string;
}

type searchFilter = ClassSearchFilter | ProfessorSearchFilter;

export = searchFilter;
