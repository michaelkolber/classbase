# Classbase

Classbase is a database and associated API for accessing the database.

The API is currently a private-facing API, but it may be turned 
into a public-facing API if the need arises. It is being built under the premise that it 
will one day be publicly exposed.

The API exposes a PostgreSQL database containing information on courses and professors.

The database and API server can be run using Docker.

There are a few terms to become familiar with:
- **Course:** A generic course given at a college. E.g. 'CSCI 120'.
- **Class:** A specific instance of a course. E.g. 'CSCI 120, Section 3, Fall 2019'.
- **Professor:** Someone who taught a class. Each class has an associated professor.

The API has a few layers at a high level:
1. **The REST API:** Clients (e.g. Gradebot) will interface with this. It presents all data 
at a high level as JSON objects.
1. **The database accessors:** An internal, non-HTTP API (e.g. Node functions) that will be 
used to interact with the database. It contains the business logic and regulates access.
1. **The database itself:** A PostgreSQL database. It currently does not have much logic 
programmed into it. Since this is a smaller project, there are no current plans to add any.

At a lower level, the API is split into 5 distinct layers:
1. **Routes:** Route requests to certain paths to the correct controller.
1. **Controllers:** Handle the different types of requests for a given path, at a higher 
level. The HTTP context ends here.
1. **Services:** Contain the majority of the business logic.
1. **Accessors:** Interacts directly with the database (data access). Makes simple requests.
1. **Database:** Currently a Postgres database.
