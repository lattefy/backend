const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  business: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  accountType: { type: Boolean, required: true },
  dashboardLink: { type: String, required: true }
})

module.exports = UserSchema;
