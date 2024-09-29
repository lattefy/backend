const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthDate: { type: String, required: true },
  lastRating: { type: Number, required: true },
  averageRating: { type: Number, required: true },
  discountAvailable: { type: Boolean, required: true },
  emissionDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  discountsGotten: { type: Number, required: true },
  discountsClaimed: { type: Number, required: true },
  totalSpent: { type: Number, required: true },
  averageExpenditure: { type: Number, required: true }
})

module.exports = ClientSchema
