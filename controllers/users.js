const User = require('../models/user');
const Thread = require('../models/thread');
const driver = require('../config/neo4j.db');

const session = driver.session();

module.exports = {
    index: async (req, res, next) => {
        const users = await User.find({})
            .sort([['created_at', 'descending']]);

        res.status(200).json(users);
    },
    create: async (req, res, next) => {
        const newUser = new User(req.body);
        const user = await newUser.save();
        await session .run('CREATE (n:User {id:{idParam},firstName:{firstNameParam},lastName:{lastNameParam},email:{emailParam}}) RETURN n.firstName', {idParam: user.id, firstNameParam: req.body.firstName, lastNameParam: req.body.lastName, emailParam: req.body.email});
        res.status(201).json(user);
    },
    edit: async (req, res, next) => {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        await session .run('MATCH (n:User) WHERE n.id = {idParam} SET n.firstName = {firstNameParam},n.lastName = {lastNameParam},n.email = {emailParam} ', {idParam: req.params.id, firstNameParam: req.body.firstName, lastNameParam: req.body.lastName, emailParam: req.body.email});
        res.status(200).json({ success: true });
    },
    delete: async (req, res, next) => {
        const user = await User.findByIdAndRemove(req.params.id);
        await session .run('MATCH (n:User{id:{idParam}}) optional match (n)-[r]-() delete n,r', {idParam: req.params.id});
        res.status(200).json({ success: true })
    },
    getById: async (req, res, next) => {
        const user = await User.findById(req.params.id);

        res.status(200).json(user)
    },
    getByName: async (req, res, next) => {
        const user = await User.find({'firstName' : new RegExp(req.query.name, 'i')});

        res.status(200).json(user)
    },
    getThreads: async (req, res, next) => {
        const user = await User.findById(req.params.id)
            .sort([['created_at', 'descending']])
            .populate({
                path: 'threads',
                ref: 'thread'
            });

        res.status(200).json(user.threads)
    },
    createThread: async (req, res, next) => {
        const newThread = new Thread(req.body);
        await newThread.save();
        await session .run('CREATE (c:Thread {id:{idParam},title:{titleParam},content:{contentParam}}) RETURN c.title', {idParam: newThread.id, titleParam: req.body.title, contentParam: req.body.content});

        const user = await User.findByIdAndUpdate(req.params.id, {
            $push: { threads: newThread }
        });
        await session .run('MATCH (a:User{id:{uidParam}}), (b:Thread{id:{tuidParam}}) MERGE(a)-[r:CREATED]-(b) RETURN a,b', {uidParam: req.params.id, tuidParam: newThread.id});
        res.status(200).json(newThread);
    }
};

