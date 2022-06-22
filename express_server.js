const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require('bcryptjs');
app.set('view engine', 'ejs');

// ### Helper imports
const { getUserByEmail, urlsForUser, registrationEmptyCheck, registrationEmailCheck, loginEmailPasswordCheck, generateRandomString } = require('./helpers.js');

const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['newKeys123']
}));

// Databases:
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "123abc"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "123abc"
  },
  "8v3jf3": {
    longURL: "https://www.spotify.com",
    userID: "userRandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("123",10) // Not common practice since the text still shows, however was informed by a mentor this is fine for the assignment
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("123",10)
  },
  "123abc": {
    id: "123abc",
    email: "123@email.com",
    password: bcrypt.hashSync("123",10)
  }
};

// ### Index Routes ###:

// Home:
app.get('/', (req, res) => {
  // res.send('Hello from Homepage');
  const userID = req.session.user_id;
  if (!userID) {
    return res.redirect('/login');
  }
});

// login Page:
app.get('/login', (req, res) => {
  res.render("urls_login");
});

// My URLs:
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    res.status(403);
    return res.redirect('/login');
  }

  const userURLs = urlsForUser(userID, urlDatabase);
  const templateVars = {
    urls: userURLs,
    user: users[userID] ? users[userID].email : null
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.redirect('/login');
  }
  const templateVars = {
    user: users[userID] ? users[userID].email : null
  };
  res.render('urls_new', templateVars);
});

// Inspect URL:
app.get('/urls/:shortURL', (req, res) => {
  const shortID = req.params.shortURL;
  const userID = req.session.user_id;

  if (!userID) {
    return res.redirect('/login');
  }
  
  if (urlDatabase[req.params.shortURL].userID !== userID) {
    return res.send("This url does not belong to this account");
    // return res.redirect('/urls');
  }

  const templateVars = {
    shortURL: shortID,
    longURL: urlDatabase[shortID].longURL,
    user: users[userID] ? users[userID].email : null
  };

  res.render("urls_show", templateVars);
});

// redirect shortURL to longURL:
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// Registration:
app.get('/register', (req, res) => {
  
  res.render("register");
});

// ### Account functions ###:

// Submit account registeration:
app.post('/register', (req, res) => {
  if (!registrationEmptyCheck(req) || !registrationEmailCheck(req, users)) {
    res.status(400);
    return res.send("400 Bad Request");
  }

  const newUserID = generateRandomString();
  users[newUserID] = { id: newUserID, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) };
  req.session['user_id'] = newUserID;
  res.redirect('/urls');
});

// login process:
app.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!password || !email) {
    return res.status(400).send("Email and password cant be blank");
  }

  const user = getUserByEmail(email, users);
  if (!user || bcrypt.compareSync(password, user.password) === false) {
    return res.status(403).send("Invalid user or password");
  }


  req.session.user_id = user.id; // correct session syntax
  res.redirect('/urls');
});

// logout process:
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// ### API Routes ###:

// CRUD METHODS:

// Create new URL api
app.post('/api/urls', (req, res) => {
  

  let shortID = generateRandomString();
  urlDatabase[`${shortID}`] = { longURL: req.body.longURL, userID: req.session.user_id};
  
  res.redirect(`/urls/${shortID}`);
});

// Read all urls: // what are these actually for?
app.get('/api/urls', (req, res) => {
  res.send('/api/urls - read all urls');
});

// Read one url: // and this one?
app.get('/api/urls/:shortURL', (req, res) => {
  res.send('/api/urls - read one url');
});

// Update one url:
app.post('/api/urls/:shortURL/update', (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    res.status(403);
    return res.redirect('/login');
  }
  if (urlDatabase[req.params.shortURL].userID !== userID) {
    res.status(400);
    return res.redirect('/urls');
  }
  
  // console.log(req);

  if (!req.body.longURL) {
    // console.log("------------");
    // console.log(`longURL: ${req.body.longURL}`);
    // console.log("------------");
    res.status(400);

    // return res.redirect('/urls');
  }

  
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls');
});

// Delete one url:
app.post('/api/urls/:shortURL/delete', (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    res.status(403);
    return res.redirect('/login');
  }

  if (urlDatabase[req.params.shortURL].userID !== userID) {
    res.status(403);
    return res.redirect('/urls');
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
