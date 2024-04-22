const { askQuestion } = require("./middleware/askQuestion");

const phoneNumber = process.env.PHONE_TEST_NUMBER;

async function authUser(client) {
  await client.start({
    phoneNumber: phoneNumber,
    password: async () => await askQuestion("Please enter your password: "),
    phoneCode: async () =>
      await askQuestion("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
}

module.exports = {
  authUser,
};
