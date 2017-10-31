'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

router.post('/', auth.isDealerORManagerORBranch(), controller.create);

router.get('/me', auth.isAuthenticated(),controller.me);
router.put('/:id/image-url',auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.imageURL);
router.get('/check-email', auth.isAuthenticated(),controller.checkEmail);
router.get('/check-username', auth.isAuthenticated(),controller.checkUsername);  
router.put('/:id/password', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.changePassword);
router.put('/:id/name', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.changeName);
router.put('/base/update', auth.hasGlobalRole('CUSTOMERADMIN'),controller.baseUserUpdate);

router.get('/all', auth.isAuthenticated(), controller.all);

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.delete('/:id', auth.isDealerORManager(), controller.destroy);
//router.put('/:id', auth.isAuthenticated(), controller.update);
//router.delete('/', auth.isAuthenticated(), controller.deleteMultiple);


module.exports = router;