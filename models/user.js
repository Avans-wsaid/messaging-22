const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'thread'
    }]
});

const User = mongoose.model('user', userSchema);
module.exports = User;