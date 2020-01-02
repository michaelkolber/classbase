
FROM postgres:12.1

# Create work directory
WORKDIR /usr/src/work

# Switch to the `postgres` user
USER postgres

# Copy the initialization files
COPY ./scripts/*.sql ./scripts/

# Copy the initialization files -- these will only run if Postgres's data directory is empty.
# See https://hub.docker.com/_/postgres, heading 'How to extend this image', sub-heading 'Initialization scripts'.
COPY ./scirpts/*.sh /docker-entrypoint-initdb.d/
