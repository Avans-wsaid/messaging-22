const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const Comment = mongoose.model('comment');

process.env.NODE_ENV = 'test';

describe('Comments controller', () => {
    it('Get to /api/v1/comments/:id returns a comment', done => {
        const comment = new Comment({ content: 'My content' });

        comment.save().then(() => {
            request(app)
                .get(`/api/v1/comments/${comment._id}`)
                .end(() => {
                    Comment.count().then(count => {
                        assert(count === 1);
                        done();
                    });
                });
        });
    });

    it('Post to /api/v1/comments requires a title', (done) => {
        request(app)
            .post('/api/v1/comments')
            .send({})
            .end((err, res) => {
                assert(res.body.error);
                done();
            });
    });

    it('Put to /api/v1/comments/id can update a record', done => {
        const comment = new Comment({ content: 'My content' });

        comment.save().then(() => {
            request(app)
                .put(`/api/v1/comments/${comment._id}`)
                .send({ content: "My new content" })
                .end(() => {
                    Comment.findOne({})
                        .then(comment => {
                            assert(comment.content === "My new content");
                            done();
                        });
                });
        });
    });

    it('Delete to /api/v1/comments/:id can delete a record', done => {
        const comment = new Comment({ content: 'My content' });

        comment.save().then(() => {
            request(app)
                .delete(`/api/v1/comments/${comment._id}`)
                .end(() => {
                    Comment.count().then(count => {
                        assert(count === 0);
                        done();
                    });
                });
        });
    });
});