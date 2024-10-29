const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const usersRoute = require('./routes/users')
const clientsRoute = require('./routes/clients')
const authRoute = require('./routes/auth') // Import the auth route

const app = express()
app.use(express.json())

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",")

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error("Not allowed by CORS"))
    }
  }
}))

// Disable Interest Cohort
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'interest-cohort=()')
  next()
})

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

// Middleware for JWT verification
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

// Define the routes
app.use('/auth', authRoute(usersConnection)) // Add authentication route
app.use('/users', authenticateToken, usersRoute(usersConnection))
app.use('/clients', authenticateToken, clientsRoute(clientsConnection))

// Start the server
const PORT = process.env.PORT || 3089
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
