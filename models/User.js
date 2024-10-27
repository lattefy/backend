const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dashboardLink: { type: String, required: true },

  name: { type: String, required: true },
  business: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  accountType: { type: Boolean, required: true }
  
})

module.exports = UserSchema;
