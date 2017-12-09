const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    created_at: { type: Date, default: Date.now },
    user: {type: Schema.Types.ObjectId, ref: 'user' }
});

const Comment = mongoose.model('comment', CommentSchema);
module.exports = Comment;