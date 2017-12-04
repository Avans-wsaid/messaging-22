const mongoose = require('mongoose');

before(done => {
    mongoose.connect('mongodb://localhost/messaging-22');
    mongoose.connection
        .once('open', () => done())
        .on('error', error => {
            console.warn('Warning', error);
        });
});

beforeEach((done) => {
    const { users, comments, threads } = mongoose.connection.collections;
    users.drop(() => {
        comments.drop(() => {
            threads.drop(() => {
                done();
            });
        });
    });
});