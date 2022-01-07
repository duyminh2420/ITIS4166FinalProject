const { promiseImpl } = require('ejs');
const model = require('../models/connection');
const rsvpModel = require('../models/rsvp');
//Send all the connections
exports.index = (req, res, next) =>{
    //res.send('send all stories');
    model.find()
    .then(connections=>res.render('./connection/index', {connections}))
    .catch(err=>next(err));
};
exports.new = (req,res) =>{
    res.render('./connection/new');
};

exports.create = (req,res, next)=>{
    let connection = new model(req.body);//create a new connection document
    connection.author = req.session.user;
    connection.save()//insert the document to the database
    .then((connection)=>{
        req.flash('success', 'Successfully created a new connection');
        res.redirect('/connection')
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
    //res.send('Created a new connection');
};

exports.show = (req,res, next)=>{
    let id = req.params.id;
    let user = req.session.user;
    Promise.all([model.findById(id), rsvpModel.count({connection: id, rsvp:'YES'})])
    .then(results=>{
        const [connection, rsvps] = results;
        if(connection) {
            return res.render('./connection/show', {connection, user, rsvps});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req,res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(connection=>{
        if(connection) {
            return res.render('./connection/edit', {connection});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));

};

exports.update = (req,res,next)=>{
    let connection = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        if(connection) {
            res.redirect('/connection/'+id);
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

exports.delete = (req,res,next)=>{
    let user = req.session.user;
    if(user){
        let id = req.params.id;
        Promise.all([model.findByIdAndDelete(id, {userFindAndModify: false}), rsvpModel.deleteMany({connection: id})])
        .then(connection =>{
            req.flash('success', 'Successfully deleted connection and associated RSVPs')
            res.redirect('/connection');
        })
        .catch(err=> {
            console.log("catch");
            if (err.name === 'ValidationError'){
                req.flash('error', err.message);
                return res.redirect('back');
            }
        next(err);
        });
    }

};

exports.editRsvp = (req, res, next) => {
    console.log(req.body.rsvp);
    let id = req.params.id;
    rsvpModel.findOne({connection: id, user: req.session.user}).then( rsvp => {
        if (rsvp) {
            //update
            rsvpModel.findByIdAndUpdate(rsvp._id, {rsvp: req.body.rsvp}, {userFindAndModify: false, runValidators: true})
            .then(rsvp => {
                req.flash('success', 'Successfully updated RSVP');
                res.redirect('/users/profile');
            })
            .catch(err => {
                console.log(err);
                if(err.name === 'ValidationError'){
                    req.flash('error', error.message);
                    return res.redirect('/back');
                }
                next(err);
            });
        } else {
            //create
            let rsvp = new rsvpModel({
                connection: id,
                rsvp: req.body.rsvp,
                user: req.session.user
            });
            rsvp.save()
            .then(rsvp =>{
                req.flash('success', 'Successfully created RSVP');
                res.redirect('/users/profile');
            })
            .catch(err => {
                req.flash('error', error.message);
                next(err);
            });

        }
    });
}

exports.deleteRsvp = (req, res, next) => {
    let id = req.params.id;
    rsvpModel.findOneAndDelete({connection: id, user:req.session.user})
    .then(rsvp=>{
        req.flash('success', 'Successfully deleted RSVP');
        res.redirect('/users/profile');
    })
    .catch(err=>{
        req.flash('error', err.message);
        next(err);
    })
}