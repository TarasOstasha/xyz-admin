var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    created: { type: Date, default: Date.now },
    lastChange: { type: Date, default: Date.now },
    name: String,
    email: String,
    password: String
})



userSchema.pre('save', function(next) {
    let user = this

    if(!user.isModified('password'))
    return next()

    //bcrypt.hash(user.password, null, null, (err, hash)=> { //- previos method
    bcrypt.hash(user.password, 10, (err, hash)=> {
        if(err) return next(err);
        user.password = hash;
        next();
    });
})

module.exports = mongoose.model('User', userSchema)