const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "aStringUsedToSignTheToken"

// ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required.
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Invalid email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    let success = false
    //If there are errors, return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Check if the user with entered email already exists.
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ success, error: "The entered email is already registered." })
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authToken });

    } catch (error) {
        res.status(500).send("Interval Server Error")
        console.log(error.message);
    }
})

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required.
router.post('/login', [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false
    //If there are errors, return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Error: Credentails cannot be verified." })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Error: Credentails cannot be verified." })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authToken });

    } catch (error) {
        res.status(500).send("Interval Server Error")
        console.log(error.message);
    }
})

// ROUTE 3: Get LoggedIn user details using: POST "/api/auth/getuser". Login required.
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        res.status(500).send("Interval Server Error")
        console.log(error.message);
    }
})

module.exports = router