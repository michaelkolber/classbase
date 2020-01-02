import csv
import psycopg2


def import_classes(filepath):
    classes = []
    try:
        with open(filepath, newline='') as distribution_file:
            distribution = csv.DictReader(distribution_file)
            for entry in distribution:
                # Account for odd values
                if entry['Instructor'].lower() in (',', '#n/a', ''):
                    entry['Instructor'] = 'Unknown, Unknown'
                if entry['Subject'].lower() in (',', '#n/a', ''):
                    entry['Subject'] = 'Unknown'
                if entry['Course Number'].lower() in (',', '#n/a', ''):
                    entry['Course Number'] = 'Unknown'
                classes.append(entry) 
        
        return classes
    except FileNotFoundError:
        print("No file found in the 'database/data/' directory (are you sure you're calling this from outside 'database/'?). Skipping import.")
        exit(0)


def get_course_ids(cursor):
    courses = {}
    
    cursor.execute('SELECT id, department, number FROM courses;')
    rows = cursor.fetchall()

    for row in rows:
        key = f'{row[1]} {row[2]}'.lower()
        value = row[0]
        courses[key] = value
    
    return courses


def get_professor_ids(cursor):
    professors = {}
    
    cursor.execute('SELECT * FROM professors;')
    rows = cursor.fetchall()

    for row in rows:
        key = f'{row[2]}, {row[1]}'.lower()
        value = row[0]        
        professors[key] = value
    
    return professors
    


if __name__ == '__main__':
    print()
    print('Inserting data into database:')
    classes = None  # A list of `dict`s imported from the csv
    db_courses = {}  # A `dict` mapping `department number` to `id`
    db_professors = {}  # A `dict` mapping `last_name, first_name` to `id`

    # Establish a connection to the server
    cnx = psycopg2.connect(database='qc', user='docker', password='docker', host='postgres')
    print('Successfully established connection to the database')
    print()


    # Import the data from the CSV file
    print('Importing classes... ', end='', flush=True)
    classes = import_classes('data/distribution.csv')
    print('done.')


    # Create a cursor
    cursor = cnx.cursor()

    # Get a list of professors and courses, and their associated `id`s. We will use these to 
    # insert the right `id` for the classes' `course_id` and `professor_id` fields.
    print('Getting course IDs... ', end='', flush=True)
    db_courses = get_course_ids(cursor)
    print('done.')
    
    print('Getting professor IDs... ', end='', flush=True)
    db_professors = get_professor_ids(cursor)
    print('done.')
    print()
    
    # Go through our `list` of classes, looking at each course and professor. If we cannot 
    # find a professor or course in our `dict`, add it to a new list. We'll insert this 
    # list, then re-download it, and use the IDs to insert the classes.
    new_courses = {}  # `dict` of `dict`s
    new_professors = {}  # `dict` of `dict`s
    
    
    # Check the courses and professors
    print('Looking for new courses and professors... ', end='', flush=True)
    for cls in classes:
        course_number = (cls['Subject'] + ' ' + cls['Course Number']).lower()
        if (course_number not in db_courses) and (course_number not in new_courses):
            new_courses[course_number] = {
                'department': cls['Subject'],
                'number': cls['Course Number'],
                'name': cls['Description'],
            }
        
        professor_name = cls['Instructor'].strip().lower()
        
        if (professor_name not in db_professors) and (professor_name not in new_professors):
            new_professors[professor_name] = {
                'first_name': cls['Instructor'].split(', ')[1].strip(),
                'last_name': cls['Instructor'].split(', ')[0].strip(),
            }
    print('done.')
    
    
    # Insert the new courses and professors
    print('Inserting new courses... ', end='', flush=True)
    for k, course in new_courses.items():
        query = 'INSERT INTO courses(department, number, name) VALUES (%s, %s, %s);'
        parameters = (course['department'], course['number'], course['name'])
        cursor.execute(query, parameters)
    cnx.commit()
    print('done.', f'Inserted {len(new_courses)} new courses.')
    
    print('Inserting new professors... ', end='', flush=True)
    for k, professor in new_professors.items():
        query = 'INSERT INTO professors(first_name, last_name) VALUES (%s, %s);'
        parameters = (professor['first_name'], professor['last_name'])
        cursor.execute(query, parameters)
    cnx.commit()
    print('done.', f'Inserted {len(new_professors)} new professors.')
    
    
    # Retrieve the new lists of courses and professors, now with their auto-incremented IDs
    print('Re-retrieving course and professor IDs... ', end='', flush=True)
    db_courses = get_course_ids(cursor)
    db_professors = get_professor_ids(cursor)
    print('done.')
    print()
    
    
    # Insert the classes
    print('Inserting classes... ', end='', flush=True)
    for cls in classes:
        # Turn the empty string into a `'0'` for numeric fields
        for key, value in cls.items():
            if key in ('Total Enrollment', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'P', 'D', 'Fail', 'Withdraw', 'Incomplete', 'Average GPA'):
                if value == '':
                    cls[key] = '0'
        
        # Account for empty instructor, department, and course values
        if cls['Instructor'] == '':
            cls['Instructor'] = 'Unknown, Unknown'
        if cls['Subject'] == '' and cls['Course Number'] == '':
            cls['Subject'] = 'Unknown'
            cls['Course Number'] = 'Unknown'
        
        query = '''INSERT INTO classes(
                        course_id,
                        professor_id,
                        section,
                        semester,
                        data_total_enrollment,
                        data_a_plus,
                        data_a,
                        data_a_minus,
                        data_b_plus,
                        data_b,
                        data_b_minus,
                        data_c_plus,
                        data_c,
                        data_c_minus,
                        data_pass,
                        data_d,
                        data_fail,
                        data_withdraw,
                        data_incomplete,
                        data_average_gpa
                   )
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'''
        parameters = (
            db_courses[(cls['Subject'] + ' ' + cls['Course Number']).lower()],
            db_professors[cls['Instructor'].lower()],
            cls['Section'],
            cls['Term'],
            cls['Total Enrollment'],
            cls['A+'],
            cls['A'],
            cls['A-'],
            cls['B+'],
            cls['B'],
            cls['B-'],
            cls['C+'],
            cls['C'],
            cls['C-'],
            cls['P'],
            cls['D'],
            cls['Fail'],
            cls['Withdraw'],
            cls['Incomplete'],
            cls['Average GPA']
        )
        
        cursor.execute(query, parameters)
    cnx.commit()
    print('done.')
    
    cnx.close()
    
    
    print()