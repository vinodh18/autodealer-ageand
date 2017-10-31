'use strict';

var express = require('express');
var controller = require('./jobcard.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var check = require('../../auth/check-limit-exceeds');

var router = express.Router();



// charts reports And Dashboard Url's
router.get('/serviceCounts', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.serviceCounts);
router.get('/revenueCounts', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.revenueCounts);
router.get('/status', auth.isSuperAdminORDealerORManager(), controller.statusStats);
router.get('/all-completed', auth.isSuperAdminORDealerORManager(), controller.completedstats);
router.get('/completed-paid', auth.isSuperAdminORDealerORManager(), controller.completedPaid);
router.get('/request', auth.isSuperAdminORDealerORManager(), controller.requestStats);

// Revenue Reports
router.get('/stats', auth.isSuperAdminORDealerORManager(), controller.serviceStats);
router.get('/userstats', auth.isSuperAdminORDealerORManager(), controller.userStats);
router.get('/revenue', auth.isSuperAdminORDealerORManager(), controller.revenue);
router.get('/topvehicles', auth.isSuperAdminORDealerORManager(), controller.topVehicles);
router.get('/topcompleted', auth.isSuperAdminORDealerORManager(), controller.topCompletedVehicles); // top Completd vechiles cout For displat table Records
// Exports 
router.get('/serviceStatusExport',auth.isSuperAdminORDealerORManager(),controller.serviceStatusExport);
router.get('/engineerExport',auth.isSuperAdminORDealerORManager(),controller.engineerExport);
router.get('/revenueExport', auth.isSuperAdminORDealerORManager(), controller.revenueExport);
 
router.post('/', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), check.limitExceeds('JOBCARD'), controller.create);
router.put('/:id', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.update);
router.put('/:id/jobcard', auth.isDealerORManagerORBranchAdminORStaff(), controller.updateJobcard);
router.put('/:id/misc-charges', auth.isDealerORManagerORBranchAdminORStaff(), controller.updateMiscCharges);
router.put('/:id/labour-charges', auth.isDealerORManagerORBranchAdminORStaff(), controller.updateLabourCharges);
router.put('/:id/accessories', auth.isDealerORManagerORBranchAdminORStaff(), controller.updateAccessories);
router.put('/:id/parts', auth.isDealerORManagerORBranchAdminORStaff(), controller.updateParts);
router.put('/:id/inprogress-status', auth.isDealerORManagerORBranchAdminORStaff(), controller.inProgressStatus);
router.put('/:id/complete-status', auth.isDealerORManagerORBranchAdminORStaff(), controller.completeStatus);
router.delete('/pending/:id', auth.hasRole('DEALER_ADMIN'), controller.destroy);
router.get('/', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.index);
router.get('/:id', auth.isDealerORManagerORBranchAdminORStaffisCustomer(), controller.show);
 
 // Remove Not Use
 router.get('/feedback', auth.isAuthenticated(), controller.checkfeedback);
 /*router.get('/users', auth.isAuthenticated(), controller.userindex);*/
 router.get('/pending', auth.isAuthenticated(), controller.pending);
 
 //router.put('/feedback/:id', auth.hasRole('CUSTOMER'), controller.updateFeedback);
 
 router.delete('/:id', auth.isAuthenticated(), controller.destroy);
 router.delete('/', auth.isAuthenticated(), controller.deleteMultiple);
 
 

 module.exports = router;