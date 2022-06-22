const getUserByEmail = (email, users) => {
  const values = Object.values(users);
  for (const user of values) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

// ### Helper Functions:

const urlsForUser = (userID, urlDatabase) => {
  const keys = urlDatabase;
  const longURLDatabase = {};
  for (const shortID in keys) {
    if (keys[shortID].userID === userID) {
      longURLDatabase[shortID] = { longURL: keys[shortID].longURL };
    }
  }
  return longURLDatabase;
};

// Check if email or password fields are empty:
const registrationEmptyCheck = (req) => {
  if (req.body.email === "" || req.body.password === "") {
    return false;
  } else {
    return true;
  }
};

// loop through emails of database:
const registrationEmailCheck = (req, users) => {
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

module.exports = { getUserByEmail, urlsForUser, registrationEmptyCheck, registrationEmailCheck, loginEmailPasswordCheck, generateRandomString };