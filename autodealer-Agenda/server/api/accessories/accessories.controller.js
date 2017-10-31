'use strict';

var AccessoriesModel = require('./accessories.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');

var globalLimit = config.globalRowsLimit;


// Get list of accessoriess
exports.index = function(req, res) {

  var queryObj = {};
  
  if (req.query.no) {
    var queryValue = req.query.no;
    var value = new RegExp("^" + queryValue, "i");
    queryObj.no = {$regex: value};
  }  
  if (req.query.dealer){
    queryObj.dealer = req.query.dealer;
  }
    
  var accessoriesLimit = req.query.limit ? req.query.limit : globalLimit;
  var accessoriesOffset = req.query.offset ? req.query.offset : 0;
  if (accessoriesLimit < 0 || accessoriesLimit > globalLimit) {
    accessoriesLimit = globalLimit;
  }

  AccessoriesModel.find(queryObj, null, {
    limit : accessoriesLimit,
    skip : accessoriesOffset
  })
  .populate('dealer')
  .exec(function(err, accessories) {
      if (!accessories) {
        sendRsp(res, 404, 'Not Found');
      }
      if (!err) {
        AccessoriesModel.count(queryObj, function(err, count) {
          var total = err ? 'N/A' : count;
          sendRsp(res, 200, 'ok', {
            total : total,
            accessories : accessories
          });
        });
      } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  });
};

// Get a single accessory
exports.show = function(req, res) {
  var id = req.params.id;
  AccessoriesModel.findById(id)
  .populate('dealer')
  .exec(function (err, accessory) {
    if (!accessory) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        accessory : accessory
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });

};

// Creates a new accessories in the DB.
exports.create = function(req, res) {

   var newAccessory = new AccessoriesModel({
    no       : req.body.no,
    desc     : req.body.desc,
    dealer   : req.user.dealer._id,
    rates    : req.body.rates
  });
  
  newAccessory.save(function(err, accessory) {
    if (!err) {
      log.info("Accessory created");
      var opts = [{path: 'dealer'}]
      AccessoriesModel.populate(accessory, opts, function(err, accessory){
        if(!err){
          sendRsp(res, 201, 'Created', {accessory : accessory });
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

// Updates an existing accessories in the DB.
exports.update = function(req, res) { 
 
  var accessoryId = req.params.id;
  AccessoriesModel.findById(accessoryId, function(err, accessory) {
    if (!accessory) {
      sendRsp(res, 404, 'Not Found');
    }
    accessory.no      = req.body.no;
    accessory.desc    = req.body.desc;
    accessory.dealer  = req.user.dealer._id;
    accessory.rates   = req.body.rates;

    accessory.save(function(err) {
      if (!err) {
        log.info("Accessory updated");
        var opts = [{path: 'dealer'}]
        AccessoriesModel.populate(accessory, opts, function(err, accessory){
          if(!err){ 
            sendRsp(res, 200, 'Updated',{accessory : accessory});
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

// Deletes a accessories from the DB.
exports.destroy = function(req, res) {
  
  var accessoryId = req.params.id;
  AccessoriesModel.findById(accessoryId, function(err, accessory) {
    if (!accessory) {
      sendRsp(res, 404, 'Not Found');
      return;
    } else {
      accessory.remove(function(err) {
        if (!err) {
          log.info("Accessory removed");
          var opts = [{path: 'dealer'}];
          AccessoriesModel.populate(accessory, opts, function(err, accessory){
            if(!err){
              sendRsp(res, 200, 'Deleted', {accessory : accessory});
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

//  Deletes multiple accessories from the DB.
exports.deleteMultiple = function (req ,res) {
  var accessoryIds = req.body.ids; 
  
  AccessoriesModel.remove({_id: {$in : accessoryIds}}, function (err) {   
      if (!err) {
          sendRsp(res, 200, 'Accessories Removed');
      } else {
          log.error('Internal error(%d): %s',res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  }); 
};



function handleError(res, err) {
  return res.send(500, err);
}