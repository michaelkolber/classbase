/**
 * The router for `/search`.
 */

import express = require('express');
import searchController = require('../controllers/searchController');
import connection = require('../dbConnection');

const router = express.Router();


router.use('/', searchController.requirePOST, searchController.search);


export = router;
