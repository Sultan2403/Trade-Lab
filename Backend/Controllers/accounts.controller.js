const {
  createAccount,
  getAccountProfile,
  getAllUserAccounts
} = require("../Services/accounts.service");

const createAccountController = async (req, res) => {
  try {
    const accountData = req.body;
    const userId = req.user.id;

    const account = await createAccount({ accountData, userId });
    res.status(201).json({
      success: true,
      message: "Your account has been created successfully",
      account,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        "An error occured while creating your account, please try again later.",
    });
  }
};

const getAccountProfileController = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user.id;

    const account = await getAccountProfile({ accountId, userId });

    res.json({
      success: true,
      account,
    });
  } catch (err) {
    console.error(err);

    if (err.message === "Account not found") {
      return res
        .status(204)
        .json({ success: true, message: "No accounts found" });
    }

    res.status(500).json({
      success: false,
      message:
        "An error occured while getting your accounts, please try again later.",
    });
  }
};

const getAllUserAccountsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const accounts = await getAllUserAccounts({ userId });

    res.json({
      success: true,
      accounts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occured" });
  }
};

module.exports = {
  createAccountController,
  getAccountProfileController,
  getAllUserAccountsController,
};
