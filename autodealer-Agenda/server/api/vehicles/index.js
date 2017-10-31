'use strict';

var express = require('express');
var controller = require('./vehicles.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var check = require('../../auth/check-limit-exceeds');

var router = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();


//router.post('/:id/image/upload', auth.isAuthenticated(), multipartyMiddleware, controller.upload);
router.put('/:id/image-url',auth.isDealerORManagerORBranchAdminORStaff(), controller.imageURL);
router.post('/', auth.isDealerORManagerORBranchAdminORStaff(), check.limitExceeds('VEHICLE'), controller.create);
router.get('/', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.index);
router.get('/:id', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.show);
router.put('/:id', auth.isDealerORManagerORBranchAdminORStaff(), controller.update);
router.delete('/:id', auth.isDealerORManager(), controller.destroy);
router.delete('/', auth.isDealerORManager(), controller.deleteMultiple);

module.exports = router;