const tradeService = require("../services/trade.service")

const createTrade = async (req, res) => {
  try {
    const trade = await tradeService.createTrade(
      req.user.id,
      req.body
    )

    res.status(201).json(trade)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTrades = async (req, res) => {
  try {
    const trades = await tradeService.getTrades(req.user.id)

    res.json(trades)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTrade = async (req, res) => {
  try {
    const trade = await tradeService.getTradeById(
      req.user.id,
      req.params.id
    )

    res.json(trade)

  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

const updateTrade = async (req, res) => {
  try {
    const trade = await tradeService.updateTrade(
      req.user.id,
      req.params.id,
      req.body
    )

    res.json(trade)

  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

const deleteTrade = async (req, res) => {
  try {
    await tradeService.deleteTrade(
      req.user.id,
      req.params.id
    )

    res.json({ message: "Trade deleted" })

  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

module.exports = {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade
}