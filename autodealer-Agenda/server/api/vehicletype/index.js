'use strict';

var express = require('express');
var controller = require('./vehicletype.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

  router.get('/all', auth.isAuthenticated(), controller.all);
  router.post('/', auth.isDealerORManagerORBranch(), controller.create);
  router.get('/', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.index);
  router.get('/:id', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.show);
  router.put('/:id', auth.isDealerORManagerORBranch(), controller.update);
  router.delete('/:id', auth.isDealerORManager(), controller.destroy);
  router.delete('/', auth.isDealerORManager(), controller.deleteMultiple);


module.exports = router;