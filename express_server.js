const express = require("express");
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');

const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Databases:
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-dino"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "funk-hawk"
  }
};


// short id generator: (referenced from: https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array -- Made it my own.)
const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i <= 6; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};



// intro to ejs code:
/*
app.get('/', (req, res) => {
  const mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birthYear: 2012},
    { name: 'Tux', organization: "Linux", birthYear: 1996},
    { name: 'Moby Dock', organization: "Docker", birthYear: 2013}
  ];
  const tagline = "No programming concept is complete without a cute animal mascot.";

  const templateVars = {
    mascots,
    tagline
  };
  res.render('pages/index', templateVars);
});
app.get('/about', (req, res) => {
  res.render('pages/about');
});
*/

// ### Index Routes ###:

// Home:
app.get('/', (req,res) => {
  res.send('Hello');
});

// My URL's:
app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  const templateVars = {
    urls: urlDatabase,
    user: users[userID].email
  };
  res.render('urls_index', templateVars);
});

// Create New Tiny URL:
app.get('/urls/new', (req,res) => {
  // if the user is logged in, and if they exist in the db
  
  const templateVars = {
    user: req.cookies["user_id"].email
  };
  res.render('urls_new', templateVars);
});

// Inspect URL:
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies["user_id"].email
  };
  res.render("urls_show", templateVars);
});

// redirect shortURL to longURL:
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]; // req.params.shortURL is what we need to reference data from the forms
  res.redirect(longURL);
});

// Registration:
app.get('/register', (req,res) => {
  // res.send('This is the registration page');
  res.render("register");
});


// ### Account functions ###:

// Submit account registeration:
app.post('/register', (req,res) => {
  let accountReg = registrationEmptyCheck(req);
  console.log(`empty check: ${accountReg}`);
  accountReg = registrationEmailCheck(req);
  console.log(`identical email check: ${accountReg}`);
  if (accountReg === true) {
    const newUserID = generateRandomString();
    users[newUserID] = { id: req.body.name, email: req.body.email, password: req.body.password };
    res.cookie('user_id', newUserID);
    res.redirect('/urls');
  } else {
    console.log("400 Bad Request");
    res.status(400);
    res.send("400 Bad Request");
    // res.redirect('/register');
  }
});

// login process:
app.post('/login', (req,res) => {
  let username = "";
  if (username !== req.body.username) {
    username = req.body.username;
    res.cookie('user_id', username);
  } else {
    res.clearCookie(username, username);
    username = req.body.username;
  }
  res.redirect('/urls');
});

// logout process:
app.post('/logout', (req,res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// ### Helper Functions:

// Console.log users objects
app.get('/api/register/consolelog', (req, res) => {
  console.log("Show users object:");
  console.log(users);


  res.redirect("/urls");
});

// Check if email or password fields are empty:
const registrationEmptyCheck = (req) => {
  if (req.body.name === "" || req.body.email === "" || req.body.password === "") {
    return false;
  } else {
    return true;
  }
};

// loop through emails of database:
const registrationEmailCheck = (req) => {
  for (const userid in users) {
    if (users[userid].email === req.body.email) {
      return false;
    }
  }
  return true;
};



// ### API Routes ###:

// CRUD METHODS:

// Create long url
app.post('/api/urls', (req, res) => {
  let shortID = generateRandomString();
  urlDatabase[`${shortID}`] = req.body.longURL;
  res.redirect(`/urls/${shortID}`);
});

// Read all urls:
app.get('/api/urls', (req, res) => {
  res.send('/api/urls - read all urls');
});

// Read one url:
app.get('/api/urls/:shortURL', (req, res) => {
  res.send('/api/urls - read one url');
});

// Update one url: // we need access to body
app.post('/api/urls/:shortURL/update', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

// Delete one url:
app.post('/api/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});