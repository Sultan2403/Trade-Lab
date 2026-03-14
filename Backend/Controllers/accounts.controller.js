const { createAccount } = require("../Services/accounts.service");

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
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createAccountController };
