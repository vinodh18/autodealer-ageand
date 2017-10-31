'use strict';

var express = require('express');
var controller = require('./offers.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

router.post('/', auth.isSuperAdminORDealerORManagerORBranchAdminORStaff(), controller.create);
router.put('/:id/image-url',auth.isSuperAdminORDealerORManagerORBranchAdminORStaff(), controller.imageURL);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', auth.isSuperAdminORDealerORManagerORBranchAdminORStaff(), controller.update);
router.delete('/:id', auth.isDealerORManager(), controller.destroy);
router.delete('/', auth.isDealerORManager(), controller.deleteMultiple);

module.exports = router;