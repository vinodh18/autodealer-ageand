'use strict';

var express = require('express');
var controller = require('./part.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.post('/', auth.isDealerORManagerORBranchAdminORStaff(), controller.create);
router.get('/',auth.isDealerORManagerORBranchAdminORStaffisCustomer(),controller.index);
router.get('/:id',auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.show);

router.put('/:id',auth.isDealerORManagerORBranchAdminORStaff(), controller.update);
router.delete('/:id',auth.isDealerORManager(), controller.destroy);
router.delete('/', auth.isDealerORManager(),controller.deleteMultiple);

module.exports = router;