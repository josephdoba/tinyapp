const express = require("express");
const app = express();
const PORT = 8080;

//set template engine:
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//index
app.get('/', function(req, res) {
  const mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birthYear: 2012},
    { name: 'Tux', organization: "Linux", birthYear: 1996},
    { name: 'Moby Dock', organization: "Docker", birthYear: 2013}
  ];
  const tagline = "No programming concept is complete without a cute animal mascot.";

  res.render('pages/index', {
    mascots: mascots,
    tagline: tagline
  });
});

// about page
app.get('/about', (req, res) => {
  res.render('pages/about');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

/*
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.render('pages/index');
});

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
  res.render("/hello");
});

app.listen(PORT, () => {
  console.log(`example app listening on port ${PORT}!`);
});

// set & fetch demo:
// app.get("/set", (req,res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// app.get("/fetch", (req,res) => {
//   res.send(`a = ${a}`);
// });
*/


