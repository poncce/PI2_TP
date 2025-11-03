// controllers/userController.js
const { User } = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = 'misecreto'

const getActiveUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } })
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getActiveUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password, estado } = req.body
        
        // Validación adicional en el controlador (sanitización)
        const cleanUsername = username.trim().replace(/\s+/g, '');
        const cleanEmail = email ? email.trim().replace(/\s+/g, '') : null;
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword,
            isAdmin: false,
            estado
        })
        
        const userResponse = user.toJSON();
        delete userResponse.password;
        
        res.status(201).json(userResponse)
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: error.errors.map(e => e.message) 
            })
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                message: 'El username o email ya está en uso' 
            })
        }
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const cleanEmail = email.trim().replace(/\s+/g, '');
        
        const user = await User.findOne({ where: { email: cleanEmail } })
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" })

        const compare = await bcrypt.compare(password, user.password)
        if (!compare) return res.status(400).json({ message: "Usuario o contraseña incorrecta" })

        const token = jwt.sign(
            { id: user.id, email: user.email, isAdmin: user.isAdmin },
            SECRET,
            { expiresIn: '8h' }
        )

        res.json({ token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body
        
        const cleanUsername = username.trim().replace(/\s+/g, '');
        const cleanEmail = email ? email.trim().replace(/\s+/g, '') : null;
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword,
            isAdmin: true
        })
        
        const userResponse = user.toJSON();
        delete userResponse.password;
        
        res.status(201).json(userResponse)
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Error de validación', 
                errors: error.errors.map(e => e.message) 
            })
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                message: 'El username o email ya está en uso' 
            })
        }
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getActiveUsers,
    getActiveUserProfile,
    registerUser,
    createAdmin,
    login,
    me
}