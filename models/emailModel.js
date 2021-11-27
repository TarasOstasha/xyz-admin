const mongoose = require('mongoose');

const emailDataSchema = mongoose.Schema({
    allInfo: { type: Array, require: true }
});



module.exports = mongoose.model('Emails', emailDataSchema);