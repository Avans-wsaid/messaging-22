const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const User = mongoose.model('user');

process.env.NODE_ENV = 'test';

describe('Users controller', () => {
    it('Get to /api/v1/users/:id returns a user', done => {
        const user = new User({ email: 'test@test.com' });

        user.save().then(() => {
            request(app)
                .get(`/api/v1/users/${user._id}`)
                .end(() => {
                    User.count().then(count => {
                        assert(count === 1);
                        done();
                    });
                });
        });
    });

    it('Post to /api/v1/users creates a new user', (done) => {
        User.count().then(count => {
            request(app)
                .post('/api/v1/users')
                .send({ email: 'test@test.com' })
                .end(() => {
                    User.count().then(newCount => {
                        assert(count + 1 === newCount);
                        done();
                    });
                });
        });
    });

    it('Post to /api/v1/users requires an email', (done) => {
        request(app)
            .post('/api/v1/users')
            .send({})
            .end((err, res) => {
                assert(res.body.error);
                done();
            });
    });

    it('Put to /api/v1/users/id can update a record', done => {
        const user = new User({ email: 'test@test.com', firstName: "Bob" });

        user.save().then(() => {
            request(app)
                .put(`/api/v1/users/${user._id}`)
                .send({ firstName: "Tim" })
                .end(() => {
                    User.findOne({ email: 'test@test.com' })
                        .then(user => {
                            assert(user.firstName === "Tim");
                            done();
                        });
                });
        });
    });

    it('Delete to /api/v1/users/:id can delete a record', done => {
        const user = new User({ email: 'test@test.com' });

        user.save().then(() => {
            request(app)
                .delete(`/api/v1/users/${user._id}`)
                .end(() => {
                    User.count().then(count => {
                        assert(count === 0);
                        done();
                    });
                });
        });
    });
});