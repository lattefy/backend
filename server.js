const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config()

const usersRoute = require('./routes/users')
const clientsRoute = require('./routes/clients')

const app = express()
app.use(express.json())

const allowedOrigins = ['https://lattefy.github.io']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

// Root route for uptime check
app.get('/', (req, res) => {
    res.send('Server is running!')
})

// Users Database connection
const usersDb = process.env.MONGO_DB_CONNECTION_USERS
const usersConnection = mongoose.createConnection(usersDb)

// Verify connection
usersConnection
    .asPromise()
    .then(() => console.log("Users db connected"))
    .catch(err => console.log("Users db connection error:", err))

// Clients Database connection
const clientsDb = process.env.MONGO_DB_CONNECTION_CLIENTS
const clientsConnection = mongoose.createConnection(clientsDb)

// Verify connection
clientsConnection
    .asPromise()
    .then(() => console.log("Clients db connected"))
    .catch(err => console.log("Clients db connection error:", err))

// Define the routes --> connection
app.use('/users', usersRoute(usersConnection)) 
app.use('/clients', clientsRoute(clientsConnection))


// Start the server
const PORT = process.env.PORT || 3089
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
