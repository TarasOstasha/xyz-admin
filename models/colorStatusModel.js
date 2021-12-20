const mongoose = require('mongoose');

const colorStatus = mongoose.Schema({
    pickedColor: { type: Array, require: true }
});



module.exports = mongoose.model('OrderColorStatus', colorStatus);