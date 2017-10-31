'use strict';

var express = require('express');
var controller = require('./misccharge.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/',auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.index);
router.get('/:id', auth.isDealerORManagerORBranchAdminORStaffisCustomer(),controller.show);
router.post('/', auth.isDealerORManagerORBranchAdminORStaffisCustomer(),controller.create);
router.put('/:id',auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.update);
router.delete('/:id', auth.isDealerORManager(),controller.destroy);
router.delete('/', auth.isDealerORManager(),controller.deleteMultiple);

module.exports = router;