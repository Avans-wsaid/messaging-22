const Thread = require('../models/thread');
const Comment = require('../models/comment');

module.exports = {
    index: async (req, res, next) => {
        const threads = await Thread.find({});

        res.status(200).json(threads);
    },
    edit: async (req, res, next) => {
        const thread = await Thread.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true })
    },
    delete: async (req, res, next) => {
        const thread = await Thread.findByIdAndRemove(req.params.id);

        res.status(200).json({ success: true })
    },
    getById: async (req, res, next) => {
        const thread = await Thread.findById(req.params.id);

        res.status(200).json(thread)
    },
    getComments: async (req, res, next) => {
        const thread = await Thread.findById(req.params.id).populate({
            path: 'comments',
            ref: 'comment'
        });

        res.status(200).json(thread.comments)
    },
    createComment: async (req, res, next) => {
        const newComment = new Comment(req.body);
        await newComment.save();

        const thread = await Thread.findByIdAndUpdate(req.params.id, {
            $push: { comments: newComment }
        });

        res.status(200).json(newComment);
    }
};

