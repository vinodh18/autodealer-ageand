'use strict';

var JobcardmasterModel = require('./jobcardmaster.model');
var passport = require('passport');
var config = require('../../config/environment');
var sendRsp = require('../utils').sendRsp;
var log = require('../libs/log')(module);
var util = require('util');
var autoIncrement = require('../auto-increment').autoIncrement;
var ObjectId = require('mongoose').Types.ObjectId;

var globalLimit = config.globalRowsLimit;


// Update sortNo for jobCardMaster
exports.updateSortNo = function(req, res) {
  
  var jobcardmasterIds = req.body.jobCardMasterSortId;  
  var count = 1;

  /*jobcardmasterIds.forEach(function(jobcardmasterId){*/
  for(var i=1; i <= jobcardmasterIds.length; i++){  
    //console.log('Id : count', jobcardmasterIds[i - 1] +':'+  count);

    JobcardmasterModel.update({"_id": new ObjectId(jobcardmasterIds[i - 1])}, {$set: {"sort_no":  i} }, function(err, numAffected) {
      if (!err) {
          //console.log('update count', count);
          if(count == jobcardmasterIds.length){
            sendRsp(res, 200, 'Success');
          } 
          count++;        
      } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
    });
  }
  /*});*/
};  

// Get list of jobcardmasters
exports.index = function(req, res) {

  var queryObj = {};
    
  if (req.query.dealer){
    queryObj.dealer = req.query.dealer;
  }
    
  var jobcardmasterLimit = req.query.limit ? req.query.limit : globalLimit;
  var jobcardmasterOffset = req.query.offset ? req.query.offset : 0;
  if (jobcardmasterLimit < 0 || jobcardmasterLimit > globalLimit) {
    jobcardmasterLimit = globalLimit;
  }

  JobcardmasterModel.find(queryObj, null, {
    limit : jobcardmasterLimit,
    skip : jobcardmasterOffset,
    sort : {'sort_no' : 1}
  })
  .populate('dealer')
  .exec(function(err, jobcardmasters) {
      if (!jobcardmasters) {
        sendRsp(res, 404, 'Not Found');
      }
      if (!err) {
        JobcardmasterModel.count(queryObj, function(err, count) {
          var total = err ? 'N/A' : count;
          sendRsp(res, 200, 'ok', {
            total : total,
            jobcardmasters : jobcardmasters
          });
        });
      } else {
          log.error('Internal error(%d): %s', res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  });

};

// Get a single jobcardmaster
exports.show = function(req, res) {
  var id = req.params.id;
  JobcardmasterModel.findById(id)
  .populate('dealer')
  .exec(function (err, jobcardmaster) {
    if (!jobcardmaster) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        jobcardmaster : jobcardmaster
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};

// Creates a new jobcardmaster in the DB.
exports.create = function(req, res) {  
  autoIncrement(req.user.dealer._id,"job_card_master", function(err, sortNo){        
    if(sortNo){
        var newJobcardmaster = new JobcardmasterModel({    
          desc     : req.body.desc,
          dealer   : req.user.dealer,
          sort_no  : sortNo,
          types    : req.body.types
        });
        
        newJobcardmaster.save(function(err, jobcardmaster) {
          if (!err) {
            log.info("Jobcardmaster created");
            var opts = [{path: 'dealer'}]
            JobcardmasterModel.populate(jobcardmaster, opts, function(err, jobcardmaster){
              if(!err){
                sendRsp(res, 201, 'Created', {jobcardmaster : jobcardmaster });
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
    }
  });

};

// Updates an existing jobcardmaster in the DB.
exports.update = function(req, res) {  
  var jobcardmasterId = req.params.id;
  JobcardmasterModel.findById(jobcardmasterId, function(err, jobcardmaster) {
    if (!jobcardmaster) {
      sendRsp(res, 404, 'Not Found');
    }
    jobcardmaster.dealer  = req.user.dealer;
    jobcardmaster.desc    = req.body.desc;
    jobcardmaster.types   = req.body.types;

    jobcardmaster.save(function(err) {
      if (!err) {
        log.info("Jobcardmaster updated");
        var opts = [{path: 'dealer'}]
        JobcardmasterModel.populate(jobcardmaster, opts, function(err, jobcardmaster){
          if(!err){ 
            sendRsp(res, 200, 'Updated',{jobcardmaster : jobcardmaster});
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

// Deletes a jobcardmaster from the DB.
exports.destroy = function(req, res) {
  var jobcardmasterId = req.params.id;
  JobcardmasterModel.findById(jobcardmasterId, function(err, jobcardmaster) {
    if (!jobcardmaster) {
      sendRsp(res, 404, 'Not Found');
      return;
    } else {
      jobcardmaster.remove(function(err) {
        if (!err) {
          log.info("Jobcardmaster removed");
          var opts = [{path: 'dealer'}];
          JobcardmasterModel.populate(jobcardmaster, opts, function(err, jobcardmaster){
            if(!err){
              sendRsp(res, 200, 'Deleted', {jobcardmaster : jobcardmaster});
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
  var jobcardmasterIds = req.body.ids; 
  
  JobcardmasterModel.remove({_id: {$in : jobcardmasterIds}}, function (err) {   
      if (!err) {
          sendRsp(res, 200, 'Jobcardmasters Removed');
      } else {
          log.error('Internal error(%d): %s',res.statusCode, err.message);
          sendRsp(res, 500, 'Server error');
      }
  }); 
};

function handleError(res, err) {
  return res.send(500, err);
}