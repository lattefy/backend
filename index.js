// BACKEND: Lattefy - Node.js Express Server --> MongoDB 

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config()

const ClientModel = require('./models/Client')

const app = express()
app.use(express.json())
app.use(cors())

const connectionString = process.env.MONGO_DB_CONNECTION
mongoose.connect(connectionString)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("Database connection error:", err))


// Root route | UptimeRobot Monitor
app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Create Client
app.post('/clients', (req, res) => {
  const { email } = req.body
  ClientModel.findOne({ email: email })
    .then(client => {
      if (client) {
        res.json("Client already exists")
      } else {
        ClientModel.create(req.body)
          .then(clients => res.json(clients))
          .catch(err => res.json(err))
      }
    })
})

// Update Client
app.put('/clients/:email', (req, res) => {
  const email = req.params.email
  const updates = req.body

  ClientModel.findOneAndUpdate({ email: email }, updates, { new: true })
    .then(client => res.json(client))
    .catch(err => res.status(500).json(err))
})

// Get Clients
app.get('/clients', (req, res) => {
  ClientModel.find()
    .then(clients => res.json(clients))
    .catch(err => res.status(500).json(err))
})

app.listen(3089, () => {
  console.log("Server is running")
})
