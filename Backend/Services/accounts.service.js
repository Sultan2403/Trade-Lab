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

const getAccountProfile = async ({ accountId, userId }) => {
  // find account by id and user
  const account = await Account.findOne({ _id: accountId, userId });

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
};

const getAllUserAccounts = async ({ userId }) => {
  const accounts = await Account.find({ userId });

  return accounts;
};

module.exports = { createAccount, getAccountProfile, getAllUserAccounts };
