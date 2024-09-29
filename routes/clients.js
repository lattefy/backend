// Server | Clients route

const express = require("express")
const router = express.Router()

// Clients Route Function
module.exports = (clientsConnection) => {

    // Create model using connection
    const ClientModel = clientsConnection.model('Client', require('../models/Client')) 

    // Create client
    router.post('/', (req, res) => {
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

    // Update client
    router.put('/:email', (req, res) => {
    const email = req.params.email
    const updates = req.body

    ClientModel.findOneAndUpdate({ email: email }, updates, { new: true })
        .then(client => res.json(client))
        .catch(err => res.status(500).json(err))
    })

    // Get clients
    router.get('/', (req, res) => {
    ClientModel.find()
        .then(clients => res.json(clients))
        .catch(err => res.status(500).json(err))
    })

    // Get Client by Email
    router.get('/:email', (req, res) => {
    const email = req.params.email
    ClientModel.findOne({ email: email })
        .then(client => res.json(client))
    })

    return router // Return clients router

}
