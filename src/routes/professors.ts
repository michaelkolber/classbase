/**
 * The router for `/professors`.
 */

import express = require('express');
import professorsController = require('../controllers/professorsController');

const router = express.Router();


// The catch-all.
router.all('/', professorsController.denyRootPath);


router.route('/:professorId')
    // Handle getting of a specific professor by its ID.
    .get(professorsController.getProfessorById);


export = router;
