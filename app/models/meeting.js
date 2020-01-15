let mongoose = require('mongoose');

let meetingSchema = new mongoose.Schema({
    user_id: String,
    meeting_date: String,
    meeting_name: String,
    meeting_description: String,
}, {collection : 'meeting'});

module.exports = mongoose.model('meeting', meetingSchema);