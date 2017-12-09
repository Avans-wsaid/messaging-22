const Comment = require('../models/comment');
const driver = require('../config/neo4j.db');

const session = driver.session();

module.exports = {
    index: async (req, res, next) => {
        const comments = await Comment.find({}).populate({
            path: 'user',
            select: 'email'
        });
        res.status(200).json(comments);
    },
    edit: async (req, res, next) => {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body);
        await session .run('MATCH (n:Comment) WHERE n.id = {idParam} SET n.content = {contentParam}', {idParam: req.params.id, contentParam: req.body.content});
        res.status(200).json({ success: true })
    },
    delete: async (req, res, next) => {
        const comment = await Comment.findByIdAndRemove(req.params.id);
        await session .run('MATCH (n:Comment{id:{idParam}}) optional match (n)-[r]-() delete n,r', {idParam: req.params.id});
        res.status(200).json({ success: true })
    },
    getById: async (req, res, next) => {
        const comment = await Comment.findById(req.params.id).populate({
            path: 'user',
            select: 'email'
        });

        res.status(200).json(comment)
    }
};

