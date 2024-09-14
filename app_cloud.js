//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const connectionRoutes = require('./routes/connectionRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv')
dotenv.config();

// create app
const app = express();
//configure app 
let port = 3000;
// let host = '127.0.0.1';

app.set('view engine', 'ejs');

const { MONGO_USER, MONGO_PASS} = process.env;
const BACKEND_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.ff1ib.mongodb.net/demos`;
// const URL = process.env.URL;

//connect to database
mongoose.connect(BACKEND_URL, {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    app.listen(port, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

//mount middlwave
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//mount middleware
app.use(session({
    secret: 'qwertyuiop',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: BACKEND_URL})
}));

//use flash 
app.use(flash());

app.use((req,res, next)=>{
    // if(!req.session.counter){
    //     req.session.counter = 1;
    // } else {
    //     req.session.counter++;
    // }
     //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

//set up routes
app.get('/', (req, res) =>{
    res.render('index');
});
app.use('/connection', connectionRoutes);
app.use('/users', userRoutes);
app.get('/about', mainRoutes);
app.get('/contact', mainRoutes);

//error handler
app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    error.status = 400;
    next(err);
});
app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status){
        err.status = 500;
        err.message =("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err})
});

//start the server