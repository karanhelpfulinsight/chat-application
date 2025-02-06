
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const {name, username, password, email} = req.body;
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or Email already exists",
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name, username, email, password: hashedPassword
        })

        await user.save();

        return res.status(201).json({
            message: 'User registered successfully',
            data: user
        })
    }catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

const loginUser = async (req, res) => {
    try {

       const { password, email} = req.body;

        const user  = await User.findOne({email: email})
        if(!user) {
            return res.status(404).json({
                message: 'User not found',
                data: {}
            })
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if(!isCorrectPassword) {
           return res.status(400).json({
                message: 'Incorrect password',
                data: {}
            })
        }

        const token = jwt.sign({_id: user._id}, 'karan', { expiresIn: '1h' });

        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 3600000,
        });
        
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: user
        });

    }catch(err) {
        console.error(err);
       return res.status(500).json({ message: 'Server Error' });
    }
}

const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {getAllUser, registerUser, loginUser}