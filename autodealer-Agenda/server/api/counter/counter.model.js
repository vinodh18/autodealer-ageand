'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CounterSchema = new Schema({
  name   : String,
  dealer : {type: Schema.Types.ObjectId, ref:'Dealer', required: true},
  seq    : Number
});

module.exports = mongoose.model('Counter', CounterSchema);