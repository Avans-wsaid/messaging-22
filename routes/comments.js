const router = require('express-promise-router')();

const commentsController = require('../controllers/comments');

router.route('/')
    .get(commentsController.index);

router.route('/:id')
    .get(commentsController.getById)
    .put(commentsController.edit)
    .delete(commentsController.delete);

module.exports = router;
