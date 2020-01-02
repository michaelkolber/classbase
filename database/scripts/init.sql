-- Create a user to manage the database
CREATE USER docker WITH SUPERUSER PASSWORD 'docker';


-- Create the default database
CREATE DATABASE qc
    WITH 
    OWNER = docker
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
