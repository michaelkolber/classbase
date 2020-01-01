/**
 * The router for `/classes`.
 */

import express = require('express');
import classesController = require('../controllers/classesController');

const router = express.Router();


// The catch-all.
router.all('/', classesController.denyRootPath);


router.route('/:classId')
    // Handle getting of a specific class by its ID.
    .get(classesController.getClassById);


export = router;
