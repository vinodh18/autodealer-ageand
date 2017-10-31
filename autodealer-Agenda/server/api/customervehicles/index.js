'use strict';

var express = require('express');
var controller = require('./customervehicles.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/all', auth.isAuthenticated(), controller.all); // PENDING FOR SHOW MANAGER OR NOT
router.post('/', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.create);
router.get('/', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.index); // PENDING FOR SHOW MANAGER OR NOT
router.get('/:id', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.show);
router.put('/:id', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.update);
router.delete('/:id', auth.isDealerORManagerORCustomer(), controller.destroy);
router.delete('/', auth.isDealerORManagerORCustomer(), controller.deleteMultiple);


module.exports = router;