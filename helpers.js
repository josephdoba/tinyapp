const getUserByEmail = (email, users) => {
  const values = Object.values(users);
  for (const user of values) {
    if (user.email === email) {
      console.log(`from helpers js: ${user}`);
      return user;
    }
  }
  return null;
};

module.exports = { getUserByEmail };