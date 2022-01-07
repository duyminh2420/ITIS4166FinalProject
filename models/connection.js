const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {type: String, required: [true, 'name is required']},
    topic: {type: String, required: [true, 'topic is required']},
    details: {type: String, required: [true, 'details is required']},
    date: {type: String, required: [true, 'date is required']},
    startTime: {type: String, required: [true, 'start time is required']},
    endTime: {type: String, required: [true, 'end time is required']},
    hostname: {type: String, required: [true, 'hostname is required']},
    image: {type: String, required: [true, 'topic is required']}
},
{timestamps: true}
);
//collection name is stories in the database
module.exports = mongoose.model('Recipe', recipeSchema);


