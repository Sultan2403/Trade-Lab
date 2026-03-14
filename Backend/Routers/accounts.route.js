const { celebrate } = require("celebrate");
const express = require("express");

const {
  createAccountController,
} = require("../Controllers/accounts.controller");
const { accountCreateSchema } = require("../Schemas/accounts.schema");

const router = express.Router();

router.post("/", celebrate({ body: accountCreateSchema }), createAccountController);

module.exports = router;
