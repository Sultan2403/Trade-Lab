const { celebrate } = require("celebrate");
const express = require("express");

const {
  createAccountController,
  getAccountProfileController,
  getAllUserAccountsController,
} = require("../Controllers/accounts.controller");

const {
  accountCreateSchema,
  accountIdSchema,
} = require("../Schemas/accounts.schema");

const authMiddleware = require("../Middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  celebrate({ body: accountCreateSchema }),
  createAccountController,
);

router.get(
  "/:accountId",
  celebrate({ params: accountIdSchema }),
  getAccountProfileController,
);

router.get("/", getAllUserAccountsController);
module.exports = router;
