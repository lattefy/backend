// Server | Users route
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Users Route Function
module.exports = (usersConnection) => {

    // Create model using connection
    const UserModel = usersConnection.model('User', require('../models/User')) 

    // Create User
    router.post('/', async (req, res) => {
        const { email, password } = req.body
        try {
            // Check if the user already exists
            const existingUser = await UserModel.findOne({ email })
            if (existingUser) return res.status(400).json("User already exists")

            // Hash password before saving
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            
            // Save new user with hashed password
            const newUser = await UserModel.create({ ...req.body, password: hashedPassword })
            res.status(201).json(newUser)
        } catch (err) {
            res.status(500).json(err.message)
        }
    })

    // Update User
    router.put('/:email', async (req, res) => {
        const email = req.params.email
        const updates = req.body

        try {
            // Update user and return updated document
            const updatedUser = await UserModel.findOneAndUpdate({ email }, updates, { new: true })
            if (!updatedUser) return res.status(404).json("User not found")
            res.json(updatedUser)
        } catch (err) {
            res.status(500).json(err.message)
        }
    })

    // Get All Users (Protected)
    router.get('/', authenticateToken, async (req, res) => {
        try {
            const users = await UserModel.find()
            res.json(users)
        } catch (err) {
            res.status(500).json(err.message)
        }
    })

    // Get User by Email (Protected)
    router.get('/:email', authenticateToken, async (req, res) => {
        const email = req.params.email
        try {
            const user = await UserModel.findOne({ email })
            if (!user) return res.status(404).json("User not found")
            res.json(user)
        } catch (err) {
            res.status(500).json(err.message)
        }
    })

    // JWT Authentication Middleware
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

    return router
}
