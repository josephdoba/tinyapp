const express = require("express");
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');

const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
    password: "purple-dino"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "funk-hawk"
  },
  "123abc": {
    id: "123abc",
    email: "123@email.com",
    password: "123"
  }
};

// ### Helper Functions:
const getUserByEmail = (email) => {
  const values = Object.values(users);
  for (const user of values) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const urlsForUser = (userID) => {
  const keys = urlDatabase;
  const longURLDatabase = {};
  // console.log(keys);
  for (const shortID in keys) {
    if (keys[shortID].userID === userID) {
      // console.log(keys[shortID].longURL);

      longURLDatabase[shortID] = { longURL: keys[shortID].longURL };
    }
    // console.log(urlDatabase[shortID].longURL);
    // console.log(urlDatabase[shortID].userID);
    // if short id.userID in urlDatabase matches users.id, return urlDatabase.shortid.longURL
  }
  return longURLDatabase;
};


// Check if email or password fields are empty:
const registrationEmptyCheck = (req) => {
  if (req.body.name === "" || req.body.email === "" || req.body.password === "") {
    return false;
  } else {
    return true;
  }
};

// Console.log users objects
app.get('/api/register/consolelog', (req, res) => {
  console.log("Show users object:");
  console.log(users);
  res.redirect("/urls");
});

// loop through emails of database:
const registrationEmailCheck = (req) => {
  for (const userid in users) {
    if (users[userid].email === req.body.email) {
      return false;
    }
  }
  return true;
};

// loop through email and password for login:
const loginEmailPasswordCheck = (req) => {
  if (!registrationEmailCheck(req)) {
    for (const password in users) {
      if (users[password].password === req.body.password) {
        return true;
      }
    }
  }
  return false;
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

// ### Index Routes ###:

// Home:
app.get('/', (req, res) => {
  res.send('Hello from Homepage');
});

// login Page:
app.get('/login', (req, res) => {
  res.render("urls_login");
});

// My URLs:
app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID) {
    res.status(403);
    return res.redirect('/login');
  }

  const userURLs = urlsForUser(userID); //should go here, but returns completely empty
  console.log(userURLs);

  const templateVars = {
    urls: userURLs,
    user: users[userID] ? users[userID].email : null
  };
  res.render('urls_index', templateVars);
});

// Create New Tiny URL:
app.get('/urls/new', (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID) {
    return res.redirect('/login');
  }
  const templateVars = {
    user: req.cookies["user_id"].email
  };
  res.render('urls_new', templateVars);
});

// Inspect URL:
app.get('/urls/:shortURL', (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID) {
    return res.redirect('/login');
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies["user_id"].email
  };
  res.render("urls_show", templateVars);
});

// redirect shortURL to longURL:
app.get('/u/:shortURL', (req, res) => {
  // might need to refactor this
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
  if (!registrationEmptyCheck(req) || !registrationEmailCheck(req)) {
    res.status(400);
    return res.send("400 Bad Request");
  }

  const newUserID = generateRandomString();
  users[newUserID] = { id: req.body.name, email: req.body.email, password: req.body.password };
  res.cookie('user_id', newUserID);
  res.redirect('/urls');
});

// login process:
app.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!password || !email) {
    return res.status(400).send("Email and password cant be blank");
  }

  const user = getUserByEmail(email);
  if (!user || password !== user.password) {
    return res.status(400).send("Invalid user or password");
  }

  // continue logging in
  res.cookie('user_id', user.id);
  res.redirect('/urls');
});

// logout process:
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
});



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