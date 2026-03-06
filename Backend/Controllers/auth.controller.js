const usersCollection = require("../DB/Models/users.model");
const bcrypt = require("bcryptjs");
const hashingRounds = 10;
const {
  verifyRefreshToken,
  generateNewTokens,
} = require("../Utils/tokens.utils");

const registerUser = async (req, res) => {
  try {
    const { password, email, ...data } = req.body;

    const pwdHash = await bcrypt.hash(password, hashingRounds);

    const createdUser = await usersCollection.create({
      ...data,
      email,
      password: pwdHash,
      balance: 0,
    });

    const user = createdUser.toJSON();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(403)
        .json({ success: false, message: "User already registered" });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;
    const existingUser = await usersCollection
      .findOne({ email })
      .select("+password");

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!passwordsMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = existingUser.toJSON();
    const tokens = await generateNewTokens(user);

    res.status(200).json({ success: true, tokens });
  } catch (error) {
    console.error(error, error.message);
    return res
      .status(500)
      .json({ success: false, message: "An error ossured" });
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const user = await verifyRefreshToken(refreshToken);
    const tokens = await generateNewTokens(user.toJSON());

    res.status(200).json({ success: true, tokens });
  } catch (err) {
    if (
      err.message.includes("token") ||
      err.message.includes("User not found") ||
      err.message.includes("mismatch")
    ) {
      return res.status(401).json({ success: false, message: err.message });
    }

    console.error(err, err?.message);
    res.status(500).json({ success: false, message: "An error occured" });
  }
};

module.exports = { registerUser, loginUser, refreshTokenController };
