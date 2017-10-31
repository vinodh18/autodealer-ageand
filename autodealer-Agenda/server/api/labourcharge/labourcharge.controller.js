'use strict';

var LabourchargeModel = require('./labourcharge.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');

var globalLimit = config.globalRowsLimit;


// Get list of labourcharges
exports.index = function(req, res) {
  var queryObj = {};
   
  if (req.query.dealer){
    queryObj.dealer = req.query.dealer;
  }
    
  var labourChargeLimit = req.query.limit ? req.query.limit : globalLimit;
  var labourChargeOffset = req.query.offset ? req.query.offset : 0;
  if (labourChargeLimit < 0 || labourChargeLimit > globalLimit) {
    labourChargeLimit = globalLimit;
  }

  LabourchargeModel.find(queryObj, null, {
    limit : labourChargeLimit,
    skip : labourChargeOffset
  })
  .populate('dealer')
  .exec(function(err, labourcharges) {
      if (!labourcharges) {
        sendRsp(res, 404, 'Not Found');
      }
      if (!err) {
        LabourchargeModel.count(queryObj, function(err, count) {
          var total = err ? 'N/A' : count;
          sendRsp(res, 200, 'ok', {
            total : total,
            labourcharges : labourcharges
          });
        });
      } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  });
};

// Get a single labourcharge
exports.show = function(req, res) {
  var id = req.params.id;
  LabourchargeModel.findById(id)
  .populate('dealer')
  .exec(function (err, labourcharge) {
    if (!labourcharge) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        labourcharge : labourcharge
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};

// Creates a new labourcharge in the DB.
exports.create = function(req, res) {
  
  var newLabourCharge = new LabourchargeModel({    
    desc     : req.body.desc,
    dealer   : req.user.dealer._id,
    rates    : req.body.rates
  });
  
  newLabourCharge.save(function(err, labourcharge) {
    if (!err) {
      log.info("labourcharge created");
      var opts = [{path: 'dealer'}]
      LabourchargeModel.populate(labourcharge, opts, function(err, labourcharge){
        if(!err){
          sendRsp(res, 201, 'Created', {labourcharge : labourcharge });
        }
      });
    } else {
      if (err.name === 'ValidationError') {
        sendRsp(res, 400, 'Validation error');
      } else {
        sendRsp(res, 500, 'Server error');
      }
      log.error('Internal error(%d): %s', res.statusCode, err.message);
    }
  });
};

// Updates an existing labourcharge in the DB.
exports.update = function(req, res) {
  
  var labourChargeId = req.params.id;
  LabourchargeModel.findById(labourChargeId, function(err, labourcharge) {
    if (!labourcharge) {
      sendRsp(res, 404, 'Not Found');
    }

    labourcharge.desc    = req.body.desc;
    labourcharge.dealer  = req.user.dealer._id;
    labourcharge.rates   = req.body.rates;

    labourcharge.save(function(err) {
      if (!err) {
        log.info("labourcharge updated");
        var opts = [{path: 'dealer'}]
        LabourchargeModel.populate(labourcharge, opts, function(err, labourcharge){
          if(!err){ 
            sendRsp(res, 200, 'Updated',{labourcharge : labourcharge});
          }
        });
      } else {
        if (err.name === 'ValidationError') {
          sendRsp(res, 400, 'Validation error');
        } else {
          sendRsp(res, 500, 'Server error');
        }
        log.error('Internal error(%d): %s', res.statusCode, err.message);
      }
    });
  });
};

// Deletes a labourcharge from the DB.
exports.destroy = function(req, res) {
  var labourChargeId = req.params.id;
  LabourchargeModel.findById(labourChargeId, function(err, labourcharge) {
    if (!labourcharge) {
      sendRsp(res, 404, 'Not Found');
      return;
    } else {
      labourcharge.remove(function(err) {
        if (!err) {
          log.info("labourcharge removed");
          var opts = [{path: 'dealer'}];
          LabourchargeModel.populate(labourcharge, opts, function(err, labourcharge){
            if(!err){
              sendRsp(res, 200, 'Deleted', {labourcharge : labourcharge});
            }
          });
        }else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
        }
      });
    }
  });
};

//  multiple delete multiple dealer

exports.deleteMultiple = function (req ,res) {
  var labourChargeIds = req.body.ids; 
  
  LabourchargeModel.remove({_id: {$in : labourChargeIds}}, function (err) {   
      if (!err) {
          sendRsp(res, 200, 'Labourcharges Removed');
      } else {
          log.error('Internal error(%d): %s',res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  }); 
};

function handleError(res, err) {
  return res.send(500, err);
}