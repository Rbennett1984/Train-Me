const mongoose = require('mongoose');

const wokroutSchema = mongoose.Schema({
	user: {type: String, required: true},
	name: {type: String, required: true},
	startDate: {type: String, required: true},
	finishDate: {type: String},
	comments: {type: String}
})

const Workout = mongoose.model('Workout', workoutSchema)

module.exports = {Workout};