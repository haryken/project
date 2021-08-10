const { arrayUsername } = require('../services/users.service');

const createUsername = async (firstName, lastName) => {
  const lastNameArr = lastName
    .split(' ')
    .map((lastNameItem) => lastNameItem.charAt(0))
    .join('');
  const username = `${firstName}${lastNameArr}`.toLowerCase();
  const listUsername = await arrayUsername(username);
  const ArrayNumber = [];

  if (listUsername[0]) {
    listUsername.forEach((element) => {
      if (element.username === username) {
        ArrayNumber.push(0);
      }
      if (element.username.slice(0, -1) === username) {
        if (!Number.isNaN(Number(element.username.slice(-1)))) {
          ArrayNumber.push(Number(element.username.slice(-1)));
        }
      }
      if (element.username.slice(0, -2) === username) {
        if (!Number.isNaN(Number(element.username.slice(-2)))) {
          ArrayNumber.push(Number(element.username.slice(-2)));
        }
      }
      if (element.username.slice(0, -3) === username) {
        if (!Number.isNaN(Number(element.username.slice(-3)))) {
          ArrayNumber.push(Number(element.username.slice(-3)));
        }
      }
      if (element.username.slice(0, -4) === username) {
        if (!Number.isNaN(Number(element.username.slice(-4)))) {
          ArrayNumber.push(Number(element.username.slice(-4)));
        }
      }
      if (element.username.slice(0, -5) === username) {
        if (!Number.isNaN(Number(element.username.slice(-5)))) {
          ArrayNumber.push(Number(element.username.slice(-5)));
        }
      }
    });
    if (ArrayNumber.length > 0) {
      const idUsername = Math.max(...ArrayNumber) + 1;
      return username + idUsername;
    }
  }
  return username;
};

module.exports = {
  createUsername,
};
