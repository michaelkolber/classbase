-- Set up the tables.
-- Courses table
CREATE TABLE public.courses
(
    id serial NOT NULL,
    department text NOT NULL,
    "number" text NOT NULL,
    name text,
    PRIMARY KEY (id)
);
ALTER TABLE public.courses
    OWNER to docker;

-- Professors table
CREATE TABLE public.professors
(
    id serial NOT NULL,
    first_name text,
    last_name text,
    PRIMARY KEY (id)
);
ALTER TABLE public.professors
    OWNER to docker;

-- Classes table
CREATE TABLE public.classes
(
    id serial NOT NULL,
    course_id integer,
    professor_id integer,
    section text,
    semester text,
    data_total_enrollment integer,
    data_a_plus integer,
    data_a integer,
    data_a_minus integer,
    data_b_plus integer,
    data_b integer,
    data_b_minus integer,
    data_c_plus integer,
    data_c integer,
    data_c_minus integer,
    data_pass integer,
    data_d integer,
    data_fail integer,
    data_withdraw integer,
    data_incomplete integer,
    data_average_gpa double precision,
    
    PRIMARY KEY (id),
    
    CONSTRAINT courses_fkey FOREIGN KEY (course_id)
        REFERENCES public.courses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,

    CONSTRAINT professors_fkey FOREIGN KEY (professor_id)
        REFERENCES public.professors (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);
ALTER TABLE public.classes
    OWNER to docker;
