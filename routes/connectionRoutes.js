const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isAuthor, isNotAuthor} = require('../middlewares/auth');
const {validateId, validateConnection,validateResult,validateRSVP } = require('../middlewares/validator');

const router = express.Router();

//GET /connections: send all stories to the user 
router.get('/', controller.index);

//GET /stories/news: send htmll form to create a new story
router.get('/new', isLoggedIn, controller.new);

//POST /stories: create a new story
router.post('/',  isLoggedIn, controller.create);

//GET /stories/:id: send details of story identified by id
router.get('/:id', validateId, controller.show);

//GET /stories/:id/edit: send html form for editing the html an existing story
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /stories/:id: update the story identified by id
router.put('/:id', validateId, isLoggedIn, isAuthor, validateConnection, validateResult, controller.update);

//DELETE /stories/:id, delete the story identified by id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

router.post('/:id/rsvp', validateId, isLoggedIn, isNotAuthor, validateRSVP, validateResult, controller.editRsvp);

router.delete('/:id/rsvp', validateId, isLoggedIn, controller.deleteRsvp);
module.exports = router;