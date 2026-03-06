const Trade = require("../models/trade.model")

const createTrade = async (userId, tradeData) => {
  const trade = await Trade.create({
    ...tradeData,
    userId
  })

  return trade
}

const getTrades = async (userId) => {
  return await Trade.find({ userId }).sort({ createdAt: -1 })
}

const getTradeById = async (userId, tradeId) => {
  const trade = await Trade.findOne({
    _id: tradeId,
    userId
  })

  if (!trade) {
    throw new Error("Trade not found")
  }

  return trade
}

const updateTrade = async (userId, tradeId, updateData) => {
  const trade = await Trade.findOneAndUpdate(
    { _id: tradeId, userId },
    updateData,
    { new: true }
  )

  if (!trade) {
    throw new Error("Trade not found")
  }

  return trade
}

const deleteTrade = async (userId, tradeId) => {
  const trade = await Trade.findOneAndDelete({
    _id: tradeId,
    userId
  })

  if (!trade) {
    throw new Error("Trade not found")
  }

  return trade
}

module.exports = {
  createTrade,
  getTrades,
  getTradeById,
  updateTrade,
  deleteTrade
}