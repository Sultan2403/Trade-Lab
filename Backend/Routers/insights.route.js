const express = require("express");
const router = express.Router();

const { celebrate } = require("celebrate");
const {
    getInsightsController
} = require("../Controllers/insights.controller");

const { accountIdSchema } = require("../Schemas/accounts.schema");


router.get("/", celebrate({ query: accountIdSchema }), getInsightsController);

module.exports = router;
