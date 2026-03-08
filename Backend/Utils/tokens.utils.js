const usersCollection = require("../DB/Models/users.model");
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

const signRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

async function verifyRefreshToken(token) {
  let userData;
  try {
    userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }

  const { id } = userData;

  const hashed = hashToken(token);

  const user = await usersCollection.findOne({
    _id: id,
    refreshTokenHash: hashed,
  });

  if (!user) throw new Error("Refresh token mismatch");

  return user;
}

async function generateNewTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const hashed = hashToken(refreshToken);

  await usersCollection.findByIdAndUpdate(user.id, {
    refreshTokenHash: hashed,
  });

  return { accessToken, refreshToken };
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  generateNewTokens,
};
