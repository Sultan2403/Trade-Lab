const Account = require("../DB/Models/accounts.model");

const createAccount = async ({ accountData, userId }) => {
  try {
    const current_balance = accountData.starting_balance;
    const account = await Account.create({
      userId,
      ...accountData,
      current_balance,
    });

    return account;
  } catch (err) {
    throw err;
  }
};

module.exports = { createAccount };
