const express = require('express');
const controller = require('../controllers/mainController');
const router = express.Router();

// router.get('/about', (req,res) =>{
//     res.send('send all the about us');
// });
router.get('/about', controller.about);
router.get('/contact', controller.contact);
module.exports = router;