'use strict';

var PartModel = require('./part.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');

var globalLimit = config.globalRowsLimit;

// Get list of parts
exports.index = function(req, res) {
  var queryObj = {};
  
  if (req.query.no) {
    var queryValue = req.query.title;
    var value = new RegExp("^" + queryValue, "i");
    queryObj.no = {$regex: value};
  }  
  if (req.query.dealer){
    queryObj.dealer = req.query.dealer;
  }
  if (req.query.group){
    queryObj.group = req.query.group;
  }
    
  var partsLimit = req.query.limit ? req.query.limit : globalLimit;
  var partsOffset = req.query.offset ? req.query.offset : 0;
  if (partsLimit < 0 || partsLimit > globalLimit) {
    partsLimit = globalLimit;
  }

  PartModel.find(queryObj, null, {
    limit : partsLimit,
    skip : partsOffset
  })
  .populate('dealer')
  .populate('group')
  .exec(function(err, parts) {
      if (!parts) {
        sendRsp(res, 404, 'Not Found');
      }
      if (!err) {
        PartModel.count(queryObj, function(err, count) {
          var total = err ? 'N/A' : count;
          sendRsp(res, 200, 'ok', {
            total : total,
            parts : parts
          });
        });
      } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  });
};

// Get a single part
exports.show = function(req, res) {
  var id = req.params.id;
  PartModel.findById(id)
  .populate('dealer')
  .exec(function (err, part) {
    if (!part) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        part : part
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};

// Creates a new part in the DB.
exports.create = function(req, res) {
  req.checkBody('group', 'Missing Params').notEmpty();
  req.checkBody('units', 'Missing Params').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    sendRsp(res, 400, 'Missing Params', util.inspect(errors));
    return;
  }

  var newPart = new PartModel({
    no      :   req.body.no,
    group   :   req.body.group,
    dealer  :   req.user.dealer,
    qty     :   req.body.qty, 
    units   :   req.body.units,
    rates   :   req.body.rates
  });
  
  newPart.save(function(err, part) {
    if (!err) {
      log.info("Part created");
      var opts = [{path: 'dealer'}, {path: 'group'}]
      PartModel.populate(part, opts, function(err, part){
        if(!err){
          sendRsp(res, 201, 'Created', {part : part });
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

// Updates an existing part in the DB.
exports.update = function(req, res) {
  req.checkBody('group', 'Missing Params').notEmpty();
  req.checkBody('units', 'Missing Params').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    sendRsp(res, 400, 'Missing Param', util.inspect(errors));
    return;
  }
  var partId = req.params.id;
  PartModel.findById(partId, function(err, part) {
    if (!part) {
      sendRsp(res, 404, 'Not Found');
    }
    part.no      = req.body.no;
    part.group   = req.body.group;
    part.dealer  = req.user.dealer;
    part.qty     = req.body.qty;
    part.units   = req.body.units;
    part.rates   = req.body.rates;

    part.save(function(err) {
      if (!err) {
        log.info("Part updated");
        var opts = [{path: 'dealer'}, {path: 'group'}]
        PartModel.populate(part, opts, function(err, part){
          if(!err){ 
            sendRsp(res, 200, 'Updated',{part : part});
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

// Deletes a part from the DB.
exports.destroy = function(req, res) {
  var partId = req.params.id;
  PartModel.findById(partId, function(err, part) {
    if (!part) {
      sendRsp(res, 404, 'Not Found');
      return;
    } else {
      part.remove(function(err) {
        if (!err) {
          log.info("Part removed");
          var opts = [{path: 'dealer'}, {path: 'group'}];
          PartModel.populate(part, opts, function(err, part){
            if(!err){
              sendRsp(res, 200, 'Deleted', {part : part});
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

// parts multiple Delete
exports.deleteMultiple = function (req ,res) {
  var partIds = req.body.ids; 
  
  PartModel.remove({_id: {$in : partIds}}, function (err) {   
      if (!err) {
          sendRsp(res, 200, 'Parts Removed');
      } else {
          log.error('Internal error(%d): %s',res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  }); 
};

function handleError(res, err) {
  return res.send(500, err);
}