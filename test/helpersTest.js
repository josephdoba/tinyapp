const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');


// For testing purposes, we need to navigate to the tests folder and use the 'mocha' command to work. 'npm test' doesn't work for some reason.

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail Function:', function() {
  it('should return true if it finds a valid email', function() {
    const user = getUserByEmail("user2@example.com", testUsers);
    const expectedUserID = "user2RandomID";
    console.log(user, expectedUserID);
    assert(user.id === expectedUserID, "Success! it returns true");
  });
});