const User = require('../models/user');
const Thread = require('../models/thread');

module.exports = {
    index: async (req, res, next) => {
        const users = await User.find({});

        res.status(200).json(users);
    },
    create: async (req, res, next) => {
        const newUser = new User(req.body);
        const user = await newUser.save();

        res.status(201).json(user);
    },
    edit: async (req, res, next) => {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true })
    },
    delete: async (req, res, next) => {
        const user = await User.findByIdAndRemove(req.params.id);

        res.status(200).json({ success: true })
    },
    getById: async (req, res, next) => {
        const user = await User.findById(req.params.id);

        res.status(200).json(user)
    },
    getThreads: async (req, res, next) => {
        const user = await User.findById(req.params.id).populate({
            path: 'threads',
            ref: 'thread'
        });

        res.status(200).json(user.threads)
    },
    createThread: async (req, res, next) => {
        const newThread = new Thread(req.body);
        await newThread.save();

        const user = await User.findByIdAndUpdate(req.params.id, {
            $push: { threads: newThread }
        });

        res.status(200).json(newThread);
    }
};

