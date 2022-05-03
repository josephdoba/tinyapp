const express = require("express");
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// short url id generator:
//referenced from: https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array -- Made it my own.
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


// ## Index routes:

app.get('/', (req,res) => {
  res.send('Hello');
});

// url's page:
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

// get route to show form:
app.get('/urls/new', (req,res) => {
  res.render('urls_new');
});

// new tiny urls page:
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

// short link to redirect to long link:
app.get('/u/:shortURL', (req, res) => {
  res.send("redirect to the long link");
});

// ## API Routes:

// CRUD METHODS:

// create long url
app.post('/api/urls', (req, res) => {
  console.log(req.body);
  let shortID = generateRandomString();
  urlDatabase[`${shortID}`] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortID}`);
  res.send('Ok');
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
  console.log(req.body);
  res.send('/api/urls - update url');
});

// Delete one url:
app.post('/api/urls/:shortURL/delete', (req, res) => {
  res.send('/api/urls - delete request');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});