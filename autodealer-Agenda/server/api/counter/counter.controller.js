'use strict';

var CounterModel = require('./counter.model');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');

var globalLimit = config.globalRowsLimit;

// Get list of counters
exports.index = function(req, res) {
  var queryObj = {};

  if(req.query.name){     
    var queryValue = req.query.name;
    var value = new RegExp("^" + queryValue,"i");
    queryObj.name = {$regex: value};
  }

  var counterLimit = req.query.limit;
  var counterOffset = req.query.offset;
  if (counterLimit < 0 || counterLimit > globalLimit) {
    counterLimit = globalLimit;
  }
  
  CounterModel.find(queryObj, null, {
      limit : counterLimit,
      skip : counterOffset
  })
  .populate('dealer')
  .exec(function(err, counters) {
      if (!counters) {
        sendRsp(res, 404, 'Not Found');
        return;
      }
      if (!err) {
        CounterModel.count(queryObj, function(err, count) {
            var total = err ? 'N/A' : count;
            sendRsp(res, 200, 'ok', {
                total : total,
                counters : counters
            });
        });
      } else {
        log.error('Internal error(%d): %s', res.statusCode, err.message);
        sendRsp(res, 500, 'Server error');
      }
  });
};

// Get a single counter
exports.show = function(req, res) {
  var id = req.params.id;
  CounterModel.findById(id)
  .populate('dealer')
  .exec(function (err, counter) {
    if (!counter) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        counter : counter
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};

// Creates a new counter in the DB.
exports.create = function(req, res) {
  req.checkBody('name', 'Missing Params').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    sendRsp(res, 400, 'Missing Param', util.inspect(errors));
    return;
  }

  var newCounter = new CounterModel({
    name  : req.body.name,
    dealer: req.user.dealer._id,
    seq   : 0
  });
  
  newCounter.save(function(err, counter) {
    if (!err) {
      log.info("Counter created");
      sendRsp(res, 201, 'Created', {
        counter : counter
      });
    } else {
      if (err.name === 'ValidationError') {
        sendRsp(res, 400, 'Validation error');
      }  else {
        sendRsp(res, 500, 'Server error');
      }
      log.error('Internal error(%d): %s', res.statusCode, err.message);
    }
  });
};

// Updates an existing counter in the DB.
exports.update = function(req, res) {
  req.checkBody('name', 'Missing Params').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    sendRsp(res, 400, 'Missing Param', util.inspect(errors));
    return;
  }
  var counterId = req.params.id;
  CounterModel.findById(counterId, function(err, counter) {
    if (!counter) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    counter.name    = req.body.name;
    counter.dealer  = req.body.dealer;
    counter.seq     = req.body.seq;

    counter.save(function(err) {
      if (!err) {
        log.info("Counter updated");
        sendRsp(res, 200, 'Updated', {
          counter : counter
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

// Deletes a counter from the DB.
exports.destroy = function(req, res) {
  var counterId = req.params.id;
  CounterModel.findById(counterId, function(err, counter) {
    if (!counter) {
      sendRsp(res, 404, 'Not Found');
      return;
    } else {
      counter.remove(function(err) {
        if (!err) {
          log.info("Counter removed");
          sendRsp(res, 200, 'Deleted', {
            counter : counter
          });
        } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
        }
      });
    }
  });
};

function handleError(res, err) {
  return res.send(500, err);
}