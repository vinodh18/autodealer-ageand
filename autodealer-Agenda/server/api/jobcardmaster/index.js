'use strict';

var express = require('express');
var controller = require('./jobcardmaster.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.post('/', auth.isDealerORManagerORBranchAdminORStaff(), controller.create);
router.put('/update-sortno', auth.isDealerORManagerORBranch(), controller.updateSortNo);
router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', auth.isDealerORManagerORBranch(), controller.update);
router.patch('/:id', auth.isDealerORManagerORBranch(), controller.update);
router.delete('/:id', auth.isDealerORManager(), controller.destroy);
router.delete('/', auth.isDealerORManager(), controller.deleteMultiple);

module.exports = router;