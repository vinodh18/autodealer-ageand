'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanSchema = new Schema({
  plan_code			    : {type: String, unique: true, required: true},
  plan_name			    : {type: String, index: true, required: true },
  plan_description	: {type:String},
  plan_limits       : {
                        branches  : {type: Number},
                        job_cards : {type: Number},
                        makes     : {type: Number},
                        models    : {type: Number},
                        vehicles  : {type: Number},
                        customers : {type: Number}
                      }, 
  price				      : {type: Number, index: true, required: true},
  currency          : {
                        code        : {type: String, index: true},
                        numeric_code: {type: Number, index: true},
                        name        : {type: String, index: true},
                        decimals    : {type: String}
                      },
  unlimited         : {type: Boolean},                     
  country           : {type: String, index: true},
  is_paid           : {type: String, enum:['PAID','FREE']},  
  yearly_price      : {type: Number, index: true},
  status				    : {type: String, enum:['ACTIVE','DISCONTINUED'], index: true, required:true},
  trail_period		  : {type: Number, required: true},
  trail_period_unit	: {type: String, enum:['DAY','MONTH'], required:true},  
  feature				    : [{key: {type: String}, value: {type:String}}]    
});

var PlanModel = mongoose.model('Plan', PlanSchema);
module.exports = PlanModel;