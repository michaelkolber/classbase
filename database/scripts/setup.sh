#!/bin/bash

# Set up the user and the database in 2 steps
psql -U postgres -a -f /usr/src/work/init.sql && psql -U postgres -d qc -a -f /usr/src/work/setup.sql;
