var express = require('express');
var app = express();
var router = express.Router();
//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var jwt = require('jwt-simple');
const bcrypt = require('bcrypt');

//const Emails = require('../models/emailModel');
//let emails = []; // arr all emails from email API

const User = require('../models/userModel');


const session = require("express-session");
const store = new session.MemoryStore();
app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
  })
);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// ** register
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    console.log('userData is working !!!!', userData)

    //console.log('register is working userData!!!!', userData)

    let user = new User(userData);
    console.log('!!!!!new user-', user)
    user.save((err, newUser) => {
      if (err) return res.status(500).send({ message: 'Error Saving User' });
      const payload = { sub: newUser._id }
      const token = jwt.encode(payload, '123')
      //then I'm going to have token
      console.log('token from register', token);
      res.status(200).send({ token, newUser }); // actually send token to front end? what's nex step?
     
    })
  } catch (error) {
    console.log('error', error)
  }
})

// ** login
router.post('/login', async (req, res) => {
  try {
    const { name } = req.body;
    const loginData = req.body;
    console.log(loginData.email)
    const user = await User.findOne({ email: loginData.email })  //request to database
    console.log(user, 'USER')
    if (!user) return res.status(401).send({ message: 'email is not exist' })

    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
      console.log('bcrypt is working', isMatch, loginData.password == user.password)
      if (!isMatch) return res.status(401).send({ message: 'email or password is not valid' })
      //I have installed jwt JSON Web Token) encode and decode module for node.js
      const payload = { sub: user._id }
      const token = jwt.encode(payload, '123')
      //then I'm going to have token
      console.log('token!!!', token);
      //res.sendStatus(200);
      res.status(200).json({ token, user }); // actually send token to front end? what's nex step?
    })
  } catch (error) {
    res.status(500).json({
      message: error
    });
  }
});




module.exports = router;
