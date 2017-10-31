/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var controller = require('./api/auth/auth.controller');
var auth = require('./auth/auth.service');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/counters', require('./api/counter'));  
  app.use('/api/dealers', require('./api/dealer'));  
  app.use('/api/ads-media', require('./api/adsmedia'));
  app.use('/api/customers', require('./api/customer'));
  app.use('/api/email-templates', require('./api/email_template'));
  app.use('/api/plans', require('./api/plan'));
  app.use('/api/labour-charges', require('./api/labourcharge'));
  app.use('/api/misc-charges', require('./api/misccharge'));
  app.use('/api/accessories', require('./api/accessories'));
  app.use('/api/parts-groups', require('./api/partsgroup'));
  app.use('/api/jobcard-masters', require('./api/jobcardmaster'));
  app.use('/api/parts', require('./api/part'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/warranty-types', require('./api/warrantytype'));
  app.use('/api/vehicle-types', require('./api/vehicletype'));
  app.use('/api/vehicles', require('./api/vehicles'));
  app.use('/api/news-events', require('./api/newsevents'));
  app.use('/api/offers', require('./api/offers'));
  app.use('/api/customer-vehicles', require('./api/customervehicles'));
  app.use('/api/device', require('./api/push'));
  app.use('/api/jobcards', require('./api/jobcard'));
  app.use('/api/auth', require('./api/auth'));
  app.post('/auth/token', require('./auth'));
  app.use('/api/appclients', require('./api/appclient'));
  app.get('/api/s3Policy', auth.isAuthenticated(), controller.getS3Policy);
   
  //app.use('/api/branches', require('./api/branch'));
  //app.use('/api/makes', require('./api/make'));
  //app.use('/api/models', require('./api/model'));  
  //app.use('/api/service-types', require('./api/servicetype'));

  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
