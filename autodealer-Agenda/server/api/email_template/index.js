'use strict';

var express = require('express');
var controller = require('./email_template.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.isDealerORManagerORBranch(),controller.create);
router.put('/:id', auth.isDealerORManagerORBranch(),controller.update);

router.get('/', auth.isDealerORManagerORBranch(),controller.index);
router.get('/all',auth.isAuthenticated(),controller.all);
router.get('/:id', auth.isDealerORManagerORBranch(),controller.show);
//router.patch('/:id', auth.isAuthenticated(),controller.update);
router.delete('/:id', auth.isDealerORManagerORBranch(),controller.destroy);
router.delete('/', auth.isDealerORManagerORBranch(),controller.deleteMultiple);

module.exports = router;