// Server | Users route

const express = require("express")
const router = express.Router()

// Users Route Function
module.exports = (usersConnection) => {

    // Create model using connection
    const UserModel = usersConnection.model('User', require('../models/User')) 

    // Create User
    router.post('/', (req, res) => {
    const { email } = req.body
    UserModel.findOne({ email: email })
        .then(user => {
        if (user) {
            res.json("User already exists")
        } else {
            UserModel.create(req.body)
            .then(users => res.json(users))
            .catch(err => res.json(err))
        }
        })
    })

    // Update User
    router.put('/:email', (req, res) => {
    const email = req.params.email
    const updates = req.body

    UserModel.findOneAndUpdate({ email: email }, updates, { new: true })
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err))
    })

    // Get Users
    router.get('/', (req, res) => {
    UserModel.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err))
    })

    // Get User by Email
    router.get('/:email', (req, res) => {
    const email = req.params.email
    UserModel.findOne({ email: email })
        .then(user => res.json(user))
    })

    return router // Return users router

}
