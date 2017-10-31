'use strict';

var express = require('express');
var controller = require('./dealer.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var check = require('../../auth/check-limit-exceeds');

var router = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

router.post('/', auth.hasRole('SUPER_ADMIN'), controller.create);
router.put('/:id', auth.isSuperAdminORDealerORManager(), controller.update);
router.put('/:id/image-url',auth.isSuperAdminORDealerORManager(), controller.imageURL);
router.put('/:id/branch', auth.isDealerORManagerORBranch(), check.limitExceeds('BRANCH'), controller.addBranch);
router.put('/:id/make', auth.isDealerORManagerORBranch(), check.limitExceeds('MAKE'), controller.addMake);
router.put('/:id/make/:makeId/model', auth.isDealerORManagerORBranch(), check.limitExceeds('MODEL'), controller.addModel);

router.get('/branches/all', auth.isDealerORManagerORBranch(), controller.allBranches);
router.get('/makes/all', auth.isDealerORManagerORBranch(), controller.allMakes);
router.get('/models/all', auth.isDealerORManagerORBranch(), controller.allModels);

router.put('/:id/branch/:branchId', auth.isDealerORManagerORBranch(), controller.updateBranch);
//router.put('/:id/make/:makeId', auth.isAuthenticated(), controller.updateMake);
//router.put('/:id/make/:makeId/model/:modelId', auth.isAuthenticated(), controller.updateModel);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:id/branch/:branchId', auth.isAuthenticated(), controller.getBranch);
router.get('/:id/make/:makeId', auth.isAuthenticated(), controller.getMake);
router.get('/:id/make/:makeId/model/:modelId', auth.isAuthenticated(), controller.getModel);

router.delete('/:id/branch/:branchId', auth.hasRole('DEALER_ADMIN'), controller.removeBranch);
router.delete('/:id/make/:makeId', auth.isDealerORManagerORBranch(), controller.removeMake);
router.delete('/:id/make/:makeId/model/:modelId', auth.isDealerORManagerORBranch(), controller.removeModel);



/*router.get('/', auth.isAuthenticated(), controller.index);
router.delete('/:id', auth.hasRole('MANAGER'), controller.destroy);
router.delete('/', auth.hasRole('MANAGER'), controller.deleteMultiple);*/


module.exports = router;