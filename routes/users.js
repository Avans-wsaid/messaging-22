const router = require('express-promise-router')();

const usersController = require('../controllers/users');

router.route('/')
    .get(usersController.index)
    .post(usersController.create);

router.route('/search')
    .get(usersController.getByName);

router.route('/:id')
    .get(usersController.getById)
    .put(usersController.edit)
    .delete(usersController.delete);

router.route('/:id/threads')
    .get(usersController.getThreads)
    .post(usersController.createThread);

module.exports = router;
