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
  },
  "123abc": {
    id: "Bob",
    email: "123@email.com",
    password: "123"
  }
};

/*
1. update the login form to use email and password
2. in post /login, use the email and password to find the user in users database
3. Return the user_id that you found
4. Set the cookie to the user_id
*/

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
app.get('/', (req,res) => {
  res.send('Hello from Homepage');
});

// login Page:
app.get('/login', (req,res) => {
  // res.send("login page");
  res.render("urls_login");
});

// My URL's:
app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id;
  
  const templateVars = {
    urls: urlDatabase,
    user: users[userID] ? users[userID].email : null
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
  if (!registrationEmptyCheck(req) || !registrationEmailCheck(req)) {
    res.status(400);
    return res.send("400 Bad Request");
  }

  const newUserID = generateRandomString();
  users[newUserID] = { id: req.body.name, email: req.body.email, password: req.body.password };
  res.cookie('user_id', newUserID);
  res.redirect('/urls');

  // res.redirect('/register');
});

// login process:
app.post('/api/login', (req,res) => {
  if (!loginEmailPasswordCheck(req)) {
    console.log("email/pw check failed, and returned false");
    res.send("Missing fields in the login page or wrong credentials. Please try again");
    return res.status(400);

  } else {
    console.log("email/pw check passed and returned true");
  }
  
  // let username = "";
  // if (username === req.body.username) {
  //   return res.status(400);
  // } else {
  //   username = req.body.username;
  //   res.cookie('user_id', username);
  //   res.redirect('/urls');
  // }
  console.log("Accessing URLs from teh login page");
  console.log(`with the values: ${req.body.email} and ${req.body.password}`);
  res.redirect('/urls');
});

// logout process:
app.post('/logout', (req,res) => {
  // username = req.body.username;
  // res.clearCookie(username, username);

  res.redirect('/');
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
// return the userID


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