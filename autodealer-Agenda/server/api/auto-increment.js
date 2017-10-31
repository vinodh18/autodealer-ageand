var CounterModel = require('./counter/counter.model');

var autoIncrement = function autoIncrement(dealerId, name, callback) {
	
	CounterModel.findOneAndUpdate({ 'dealer': dealerId, 'name' : name },
		{ $inc: { seq: 1 } },function(err, counter){
			console.log('counter inner', counter); 
			if(counter){
				callback(null,counter.seq);
			}  	
    });
      	
};

module.exports.autoIncrement = autoIncrement;