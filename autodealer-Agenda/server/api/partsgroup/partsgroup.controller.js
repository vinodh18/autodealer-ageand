'use strict';

var PartsGroupModel = require('./partsgroup.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var deepPopulate  = require('mongoose-deep-populate');
/*mongoose.connect('mongodb://localhost/deep-populate')*/
var globalLimit = config.globalRowsLimit;

// Get list of partsgroups
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
    
  var partsGroupLimit = req.query.limit ? req.query.limit : globalLimit;
  var partsGroupOffset = req.query.offset ? req.query.offset : 0;
  if (partsGroupLimit < 0 || partsGroupLimit > globalLimit) {
    partsGroupLimit = globalLimit;
  }

  PartsGroupModel.find(queryObj, null, {
    limit : partsGroupLimit,
    skip : partsGroupOffset
  })  
  .populate('dealer')
  .exec(function(err, partsgroups) {
      if (!partsgroups) {
        sendRsp(res, 404, 'Not Found');
      }
      if (!err) {
        PartsGroupModel.count(queryObj, function(err, count) {
          var total = err ? 'N/A' : count;
          sendRsp(res, 200, 'ok', {
            total : total,
            partsgroups : partsgroups
          });
        });
      } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  });
};

// Get a single partsgroup
exports.show = function(req, res) {
  var id = req.params.id;
  PartsGroupModel.findById(id)
  .populate('dealer')
  .exec(function (err, partsgroup) {
    if (!partsgroup) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        partsgroup : partsgroup
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};

// Creates a new partsgroup in the DB.
exports.create = function(req, res) {
  
  var newPartsGroup = new PartsGroupModel({
    no       : req.body.no,
    dealer   : req.user.dealer._id,
    desc     : req.body.desc    
  });
  
  newPartsGroup.save(function(err, partsgroup) {
    if (!err) {
      log.info("Partsgroup created");
      var opts = [{path: 'dealer'}]
      PartsGroupModel.populate(partsgroup, opts, function(err, partsgroup){
        if(!err){
          sendRsp(res, 201, 'Created', {partsgroup : partsgroup });
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

// Updates an existing partsgroup in the DB.
exports.update = function(req, res) {
 
  var partsGroupId = req.params.id;
  PartsGroupModel.findById(partsGroupId, function(err, partsgroup) {
    if (!partsgroup) {
      sendRsp(res, 404, 'Not Found');
    }
    partsgroup.no     = req.body.no;
    partsgroup.dealer  = req.user.dealer;
    partsgroup.desc    = req.body.desc;
        

    partsgroup.save(function(err) {
      if (!err) {
        log.info("Partsgroup updated");
        var opts = [{path: 'dealer'}]
        PartsGroupModel.populate(partsgroup, opts, function(err, partsgroup){
          if(!err){ 
            sendRsp(res, 200, 'Updated',{partsgroup : partsgroup});
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

// Deletes a partsgroup from the DB.
exports.destroy = function(req, res) {
  var partsGroupId = req.params.id;
  PartsGroupModel.findById(partsGroupId, function(err, partsgroup) {
    if (!partsgroup) {
      sendRsp(res, 404, 'Not Found');
      return;
    } else {
      partsgroup.remove(function(err) {
        if (!err) {
          log.info("Partsgroup removed");
          var opts = [{path: 'dealer'}];
          PartsGroupModel.populate(partsgroup, opts, function(err, partsgroup){
            if(!err){
              sendRsp(res, 200, 'Deleted', {partsgroup : partsgroup});
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

//  partsGroup Multiple Delete
exports.deleteMultiple = function (req ,res) {
  var partsGroupIds = req.body.ids; 
  
  PartsGroupModel.remove({_id: {$in : partsGroupIds}}, function (err) {   
      if (!err) {
          sendRsp(res, 200, 'Partsgroup Removed');
      } else {
          log.error('Internal error(%d): %s',res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  }); 
};

exports.all = function(req, res) {
  var queryObj = {};
  
  PartsGroupModel.find(queryObj, '_id no', null, function(err, partsgroup) {
    if (!partsgroup) {
      sendRsp(res, 404, 'Not Found');
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        partsgroup : partsgroup
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};
function handleError(res, err) {
  return res.send(500, err);
}