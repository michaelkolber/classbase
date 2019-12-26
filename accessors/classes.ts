/**
 * A CRUD interface for the database's `classes` collection.
 */

import models = require('../models');


function getClassById(id: string, callback: (err, result) => any) {
    if (!id) {
        throw Error('You must provide an id.');
    }
    
    return models.Class.findById(id, callback);
}

export {getClassById};
