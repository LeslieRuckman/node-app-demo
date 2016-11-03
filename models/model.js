var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var herbSchema = new Schema({
	herb: String,
	// name: {type: String, required: true}, // this version requires this field to exist
	// name: {type: String, unique: true}, // this version requires this field to be unique in the db
	botanicalName: String,
	flavor: String,
	heal: String,
	prepare: String,
	recipe: String,
	url: String,
	tags: [String],
	dateAdded : { type: Date, default: Date.now },
})

// export 'Animal' model so we can interact with it in other files
module.exports = mongoose.model('Herb',herbSchema);
