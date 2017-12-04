const router = require('express-promise-router')();

const threadsController = require('../controllers/threads');

router.route('/')
    .get(threadsController.index);

router.route('/:id')
    .get(threadsController.getById)
    .put(threadsController.edit)
    .delete(threadsController.delete);

router.route('/:id/comments')
    .get(threadsController.getComments)
    .post(threadsController.createComment);

module.exports = router;
