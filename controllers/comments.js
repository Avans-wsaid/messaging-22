const Comment = require('../models/comment');

module.exports = {
    index: async (req, res, next) => {
        const comments = await Comment.find({});

        res.status(200).json(comments);
    },
    edit: async (req, res, next) => {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true })
    },
    delete: async (req, res, next) => {
        const comment = await Comment.findByIdAndRemove(req.params.id);

        res.status(200).json({ success: true })
    },
    getById: async (req, res, next) => {
        const comment = await Comment.findById(req.params.id);

        res.status(200).json(comment)
    }
};

