const getUserByEmail = (email, users) => {
  const values = Object.values(users);
  for (const user of values) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

module.exports = { getUserByEmail };