const Thread = require('../models/thread');
const Comment = require('../models/comment');
const driver = require('../config/neo4j.db');

const session = driver.session();

module.exports = {
    index: async (req, res, next) => {
        const threads = await Thread.find({});

        res.status(200).json(threads);
    },
    edit: async (req, res, next) => {
        const thread = await Thread.findByIdAndUpdate(req.params.id, req.body);
        await session .run('MATCH (n:Thread) WHERE n.id = {idParam} SET n.title = {titleParam},n.content = {contentParam}', {idParam: req.params.id, titleParam: req.body.title, contentParam: req.body.content});
        res.status(200).json({ success: true })
    },
    delete: async (req, res, next) => {
        const thread = await Thread.findByIdAndRemove(req.params.id);
        await session .run('MATCH (n:Thread{id:{idParam}}) optional match (n)-[r]-() delete n,r', {idParam: req.params.id});
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
        await session .run('CREATE (c:Comment {id:{idParam},content:{contentParam}}) RETURN c.content', {idParam: newComment.id, contentParam: req.body.content});

        const thread = await Thread.findByIdAndUpdate(req.params.id, {
            $push: { comments: newComment }
        });
        await session .run('MATCH (a:Thread{id:{uidParam}}), (b:Comment{id:{tuidParam}}) MERGE(b)-[r:IS_IN]-(a) RETURN b,a', {uidParam: req.params.id, tuidParam: newComment.id});
        await session .run('MATCH (a:Comment{id:{cidParam}}), (b:User{id:{uuidParam}}) MERGE(b)-[r:COMMENTED]-(a) RETURN b,a', {cidParam: newComment.id, uuidParam: req.body.user});

        res.status(200).json(newComment);
    }
};
