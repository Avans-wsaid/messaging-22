const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const Thread = mongoose.model('thread');

process.env.NODE_ENV = 'test';

describe('Threads controller', () => {
    it('Get to /api/v1/threads/:id returns a thread', done => {
        const thread = new Thread({ title: 'My title' });

        thread.save().then(() => {
            request(app)
                .get(`/api/v1/threads/${thread._id}`)
                .end(() => {
                    Thread.count().then(count => {
                        assert(count === 1);
                        done();
                    });
                });
        });
    });

    it('Post to /api/v1/threads requires a title', (done) => {
        request(app)
            .post('/api/v1/threads')
            .send({})
            .end((err, res) => {
                assert(res.body.error);
                done();
            });
    });

    it('Put to /api/v1/threads/id can update a record', done => {
        const thread = new Thread({ title: 'My title', content: "My content" });

        thread.save().then(() => {
            request(app)
                .put(`/api/v1/threads/${thread._id}`)
                .send({ content: "My new content" })
                .end(() => {
                    Thread.findOne({ title: 'My title' })
                        .then(thread => {
                            assert(thread.content === "My new content");
                            done();
                        });
                });
        });
    });

    it('Delete to /api/v1/threads/:id can delete a record', done => {
        const thread = new Thread({ title: 'My title' });

        thread.save().then(() => {
            request(app)
                .delete(`/api/v1/threads/${thread._id}`)
                .end(() => {
                    Thread.count().then(count => {
                        assert(count === 0);
                        done();
                    });
                });
        });
    });
});