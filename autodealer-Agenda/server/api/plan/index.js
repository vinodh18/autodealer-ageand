'use strict';

var express = require('express');
var controller = require('./plan.controller');
var auth = require('../../auth/auth.service');
var check = require('../../auth/check-limit-exceeds');

var router = express.Router();

router.post('/', auth.hasRole('SUPER_ADMIN'), controller.create);
router.put('/:id', auth.hasRole('SUPER_ADMIN'), controller.update);
router.get('/limit/customer', auth.isDealerORBranch(), check.limitExceeds('CUSTOMER'), controller.checkCustomerLimit);
router.get('/limit/job-cards', auth.isDealerORBranch(), check.limitExceeds('JOBCARD'), controller.checkJobCardsLimit);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.delete('/', auth.hasRole('SUPER_ADMIN'), controller.deleteMultiple);
router.delete('/:id', auth.hasRole('SUPER_ADMIN'), controller.destroy);

module.exports = router;