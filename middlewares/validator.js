// const model = require('../models/connection');
const {body} = require('express-validator');
const {validationResult} = require('express-validator');
exports.validateId = (req, res, next) => {
    //an objectId is a 24-bit Hex string
    let id = req.params.id;
    if(id.match(/^[0-9a-fA-F]{24}$/))
        return next();
    else {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } 
};

exports.validateRSVP = [body('rsvp').isIn(['YES', 'NO', 'MAYBE'])];

exports.validateSignUp = 
[body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn =
[body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (res, req, next) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        })
        return res.redirect('back');
    } else{
        return next();
    }
};

exports.validateConnection =
[body('title', 'Title cannot be empty').notEmpty().trim().escape(),
body('content', 'Content must be at least 10 characters').trim().escape().isLength({min: 10})];
