import mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;


// Course
const courseSchema = new mongoose.Schema({
    department: {
        required: true,
        type: String,
    },
    number: {
        required: true,
        type: String,
    },
});

const Course = mongoose.model('Course', courseSchema);


// Class
const classSchema = new mongoose.Schema({
    course: {
        ref: 'Course',
        required: true,
        type: ObjectId,
    },
    professor: {
        ref: 'Professor',
        required: true,
        type: ObjectId,
    },
    section: {
        required: true,
        type: String,
    },
    semester: {
        required: true,
        type: String,
    },
});

const Class = mongoose.model('Class', classSchema);


// Professor
const professorSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
});

const Professor = mongoose.model('Professor', professorSchema);

export {Course, Class, Professor};
