const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const router = express.Router()

// Sample in-memory store for refresh tokens; consider using a database for production.
let refreshTokens = []

module.exports = (usersConnection) => {
    const UserModel = usersConnection.model('User', require('../models/User'))

    // Login and generate tokens
    router.post('/login', async (req, res) => {
        const { email, password } = req.body
        try {
            const user = await UserModel.findOne({ email })
            if (!user) return res.status(400).json("Cannot find user")

            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) return res.status(403).json("Invalid password")

            const accessToken = generateAccessToken({ email: user.email })
            const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET)

            refreshTokens.push(refreshToken) // Store refresh token
            res.json({ accessToken, refreshToken })
        } catch (err) {
            res.status(500).json("Server error")
        }
    })

    // Generate new access token using a refresh token
    router.post('/token', (req, res) => {
        const refreshToken = req.body.token
        if (!refreshToken) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ email: user.email })
            res.json({ accessToken })
        })
    })

    // Logout to invalidate the refresh token
    router.delete('/logout', (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.body.token)
        res.sendStatus(204)
    })

    // Helper function to generate an access token
    function generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
    }

    return router
}
