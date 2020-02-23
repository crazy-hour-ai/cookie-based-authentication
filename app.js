//npm modules
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');

const FileStore = require('session-file-store')(session);

const bodyParser = require('body-parser');

const exphbs = require('express-handlebars');
const login = require('./login');

const port = 3000;

// create the server
const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// add & configure middleware
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// // create the homepage route at '/'
// app.get('/', (req, res) => {
//   console.log('Inside the homepage callback function')
//   console.log(req.sessionID)
//   const uniqueId = uuid();
//   res.send(`Hit home page. Received the unique id: ${uniqueId}\n`)
// })

// create the login get and post routes


// app.get('/login', (req, res) => {
//   console.log('Inside GET /login callback function')
//   console.log(req.sessionID)
//   res.send(`You got the login page!\n`)
// })

// app.post('/login', (req, res) => {
//   console.log('Inside POST /login callback function')
//   console.log(req.body)
//   res.send(`You posted to the login page!\n`)
// })


app.get('/', (req, res) => {
  console.log('Inside GET /login callback function')
  console.log(req.sessionID);
  res.render('index');
})


app.post('/', (req, res) => {
  const options = req.body;
  let authenticate = login(options);

  if (options.email === '') {
    res.render('index', { emailEmpty: options })
  }
  else {
    if (authenticate.status === 'correct' && req.sessionID) {
      res.render('welcome', { loginSuccess: authenticate.name, options });
    }
    else if (authenticate.status === 'wrong') {
      res.render('index', { passwordWrong: authenticate.status, options })
    }
    else {
      res.render('index', { usernameWrong: authenticate.status, options });
    }
  }

})

// tell the server what port to listen on
app.listen(port, () => {
  console.log(`Listening on localhost:${port}`)
})