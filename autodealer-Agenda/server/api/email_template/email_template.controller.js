'use strict';

var _                   = require('lodash');
var EmailTemplateModel  = require('./email_template.model');
var config              = require('../../config/environment');
var sendRsp             = require('../utils').sendRsp;
var log                 = require('../libs/log')(module);
var util                = require('util');

var globalLimit   = config.globalRowsLimit;

// Get list of email templates
exports.index = function(req, res) {
    var queryObj = {};
    queryObj.dealer = req.user.dealer._id;    
    if (req.query.name) {
      var queryValue = req.query.name;        
      var value = new RegExp("^" + queryValue,"i");         
      queryObj.name = {$regex: value};
    }

    var emailTemplateLimit = req.query.limit;
    var emailTemplateOffset = req.query.offset;
    var emailTemplateSort = {
        '_id' : 1
    };

    if (emailTemplateLimit < 0 || emailTemplateLimit > globalLimit) {
      emailTemplateLimit = globalLimit;
    }  
    EmailTemplateModel.find(queryObj, null, {
        limit : emailTemplateLimit,
        skip : emailTemplateOffset,
        sort : emailTemplateSort
      }).populate('dealer').exec(
          function(err, emailTemplates) {
            if (!emailTemplates) {
              sendRsp(res, 404, 'Not Found');
              return;
            }
            if (!err) 
            {
              EmailTemplateModel.count(queryObj, function(err, count) {
                var total = err ? 'N/A' : count;
                sendRsp(res, 200, 'OK', {
                  total : total,
                  email_templates : emailTemplates
                });
              });
              
            } else {
              log.error('Internal error(%d): %s', res.statusCode,
                  err.message);
              sendRsp(res, 500, 'Server error');
            }
      });
};

//Get list specific fields of email_templates for dropdown
exports.all = function(req, res) {  
  var queryObj = {};
  queryObj.dealer = req.user.dealer._id;
  EmailTemplateModel.find(queryObj, '_id name', null , function(err, email_templates) {
    if (!email_templates) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      EmailTemplateModel.count(queryObj, function(err, count) {
        var total = err ? 'N/A' : count;
        sendRsp(res, 200, 'OK', {
          total : total,
          email_templates : email_templates
        });
      });
      
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};

// Get a single email_template
exports.show = function(req, res) {  
  var id = req.params.id;
  var dealer = req.user.dealer._id;
  EmailTemplateModel.findById(id)
    .populate('dealer')
    .exec(function(err, emailTemplate) {
    if (!emailTemplate || emailTemplate.dealer.id != dealer) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    if (!err) {
      sendRsp(res, 200, 'OK', {
        email_template : emailTemplate
      });
    } else {
      log.error('Internal error(%d): %s', res.statusCode, err.message);
      sendRsp(res, 500, 'Server error');
    }
  });
};

// Creates a new emailTemplate in the DB.
exports.create = function(req, res) {
  req.checkBody('name', 'Missing Query Param').notEmpty();
  req.checkBody('subject', 'Missing Query Param').notEmpty();
  req.checkBody('body', 'Missing Query Param').notEmpty();
  
  var errors = req.validationErrors();
  if (errors) {
    sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
    return;
  }

  var newEmailTemplate = new EmailTemplateModel({
    dealer      : req.user.dealer._id,
    name        : req.body.name,
    subject     : req.body.subject,
    body        : req.body.body,
    created_at  : Date.now()
  });
  
  newEmailTemplate.save(function(err, email_template) {
    if (!err) {
      log.info("email template created");
      var opts = [{path: 'dealer'}]
      EmailTemplateModel.populate(email_template, opts, function(err, email_template){
        if(!err){ 
          sendRsp(res, 201, 'Created', {email_template: email_template});
        }
      });     
    } else {
      console.log(err);
      if (err.name === 'ValidationError') {
        sendRsp(res, 400, 'Validation error');
      } else {
        sendRsp(res, 500, 'Server error');
      }
      log.error('Internal error(%d): %s', res.statusCode, err.message);
    }
  });
};

// Updates an existing email template in the DB.
exports.update = function(req, res) {
  req.checkBody('name', 'Missing Query Param').notEmpty();
  req.checkBody('subject', 'Missing Query Param').notEmpty();
  req.checkBody('body', 'Missing Query Param').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    sendRsp(res, 400, 'Missing Query Param', util.inspect(errors));
    return;
  }

  var emailTemplateId = req.params.id; 
  EmailTemplateModel.findById(emailTemplateId, function(err, emailTemplate) {
    if (!emailTemplate) {
      sendRsp(res, 404, 'Not Found');
      return;
    }
    
    emailTemplate.dealer      = req.user.dealer._id;
    emailTemplate.name        = req.body.name;
    emailTemplate.subject     = req.body.subject;
    emailTemplate.body        = req.body.body;    
    emailTemplate.updated_at  = Date.now();

    emailTemplate.save(function(err,email_template) {
      if (!err) {
        log.info("email template updated");
        var opts = [{path: 'dealer'}]
        EmailTemplateModel.populate(email_template, opts, function(err, email_template){
          if(!err){ 
            sendRsp(res, 200, 'Updated', {email_template: email_template});
            return;
          }
        });         
      } else {
        if (err.name === 'ValidationError') {
          sendRsp(res, 400, 'Validation error');
        } else {
          sendRsp(res, 500, 'Server error');
        }
        log.error('Internal error(%d): %s', res.statusCode,
                err.message);
      }
    });
  });
};

// Deletes a email template from the DB.
exports.destroy = function(req, res) {
  var emailTemplateId = req.params.id;
  EmailTemplateModel.findById(emailTemplateId, function(err, emailTemplate) {
    if (!emailTemplate) {
      sendRsp(res, 404, 'Not Found');
      return;
    } else {
      emailTemplate.remove(function(err,email_template) {
        if (!err) {
          log.info("email template removed");
          var opts = [{path: 'dealer'}]
          EmailTemplateModel.populate(email_template, opts, function(err, email_template){
            if(!err){ 
              sendRsp(res, 200, 'Deleted', {email_template: email_template});
              return;
            }
          });         
        } else {
          log.error('Internal error(%d): %s', res.statusCode,
              err.message);
          sendRsp(res, 500, 'Server error');
        }
      });
    }
  });
};

// Deletes multiple email template from the DB.
exports.deleteMultiple = function (req ,res) {
  var emailTemplateIds = req.body.ids;
  EmailTemplateModel.remove({_id: {$in : emailTemplateIds}}, function (err) {   
      if (!err) {
          sendRsp(res, 200, 'Email template Removed');
      } else {
          log.error('Internal error(%d): %s',res.statusCode,err.message);
          sendRsp(res, 500, 'Server error');
      }
  }); 
};

function handleError(res, err) {
  return res.send(500, err);
}