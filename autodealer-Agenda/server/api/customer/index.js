'use strict';

var express = require('express');
var controller = require('./customer.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var check = require('../../auth/check-limit-exceeds');

var router = express.Router();

router.post('/', auth.isSuperAdminORDealerORManagerORBranchAdminORStaff(), check.limitExceeds('CUSTOMER'), controller.create);
router.put('/:id', auth.hasRole('CUSTOMER'), controller.update);
router.delete('/:id', auth.isSuperAdminORDealerORManager(), controller.destroy);

router.get('/all', auth.isAuthenticated(), controller.all);
router.get('/', auth.isSuperAdminORDealerORManagerORBranchAdminORStaff(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);


//router.delete('/', auth.isAuthenticated(), controller.deleteMultiple);


module.exports = router;