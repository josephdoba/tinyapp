const express = require("express");
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//index
app.get('/', (req, res) => {
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

// url's page:
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});