'use strict';

var MiscChargeModel = require('./misccharge.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');

var globalLimit = config.globalRowsLimit;

// Get list of misccharges
exports.index = function(req, res) {  
  
  var queryObj = {};
   
  if (req.query.dealer){
    queryObj.dealer = req.query.dealer;
  }
    
  var miscChargeLimit = req.query.limit ? req.query.limit : globalLimit;
  var miscChargeOffset = req.query.offset ? req.query.offset : 0;
  if (miscChargeLimit < 0 || miscChargeLimit > globalLimit) {
    miscChargeLimit = globalLimit;
  }

  MiscChargeModel.find(queryObj, null, {
    limit : miscChargeLimit,
    skip : miscChargeOffset
  })
  .populate('dealer')
  .exec(function(err, misccharges) {
      if (!misccharges) {
        sendRsp(res, 404, 'Not Found');
      }
      if (!err) {
        MiscChargeModel.count(queryObj, function(err, count) {
          var total = err ? 'N/A' : count;
          sendRsp(res, 200, 'ok', {
            total : total,
            misccharges : misccharges
          });
        });
      } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  });
};

// Get a single misccharge
exports.show = function(req, res) {
  var id = req.params.id;
  MiscChargeModel.findById(id)
  .populate('dealer')
  .exec(function (err, misccharge) {
    if (!misccharge) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        misccharge : misccharge
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};

// Creates a new misccharge in the DB.
exports.create = function(req, res) {
  
  var newMiscCharge = new MiscChargeModel({    
    desc     : req.body.desc,
    dealer   : req.user.dealer._id,
    rates   : req.body.rates
  });
  
  newMiscCharge.save(function(err, misccharge) {
    if (!err) {
      log.info("MiscCharge created");
      var opts = [{path: 'dealer'}]
      MiscChargeModel.populate(misccharge, opts, function(err, misccharge){
        if(!err){
          sendRsp(res, 201, 'Created', {misccharge : misccharge });
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

// Updates an existing misccharge in the DB.
exports.update = function(req, res) {
  
  var miscChargeId = req.params.id;
  MiscChargeModel.findById(miscChargeId, function(err, misccharge) {
    if (!misccharge) {
      sendRsp(res, 404, 'Not Found');
    }
    
    misccharge.desc    = req.body.desc;
    misccharge.dealer  = req.user.dealer._id;
    misccharge.rates   = req.body.rates;

    misccharge.save(function(err) {
      if (!err) {
        log.info("Misccharge updated");
        var opts = [{path: 'dealer'}]
        MiscChargeModel.populate(misccharge, opts, function(err, misccharge){
          if(!err){ 
            sendRsp(res, 200, 'Updated',{misccharge : misccharge});
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

// Deletes a misccharge from the DB.
exports.destroy = function(req, res) {
  var miscChargeId = req.params.id;
  MiscChargeModel.findById(miscChargeId, function(err, misccharge) {
    if (!misccharge) {
      sendRsp(res, 404, 'Not Found');
      return;
    } else {
      misccharge.remove(function(err) {
        if (!err) {
          log.info("Misccharge removed");
          var opts = [{path: 'dealer'}];
          MiscChargeModel.populate(misccharge, opts, function(err, misccharge){
            if(!err){
              sendRsp(res, 200, 'Deleted', {misccharge : misccharge});
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

// delete Multiple miscCharges
exports.deleteMultiple = function (req ,res) {
  var miscChargeIds = req.body.ids; 
  
  MiscChargeModel.remove({_id: {$in : miscChargeIds}}, function (err) {   
      if (!err) {
          sendRsp(res, 200, 'Misccharges Removed');
      } else {
          log.error('Internal error(%d): %s',res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  }); 
};

function handleError(res, err) {
  return res.send(500, err);
}