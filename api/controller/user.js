const { User } = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Calification } = require("../models/Califications")
const { Permission } = require("../models/Perms")
const { Post } = require("../models/Posts")

const SECRET = 'misecreto'

const getActiveUsers = async (req, res) => {
    const users = await User.findAll({ attributes: { exclude: ['password'] } })
    res.json(users)
}


const getActiveUserProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin: false
    })
    res.json(user)
}

       

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(400).json({ message: "usuario no encontrado" })

    const compare = await bcrypt.compare(password, user.password)
    if (!compare) return res.status(400).json({ message: "usuario o contraseña incorrecta" })

    const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        SECRET,
        { expiresIn: '8h' }
    )

    res.json({ token })
}

const me = async (req, res) => {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } })
    res.json(user)
}

const createAdmin = async (req, res) => {                           // checkear con marcos, no es serio hacerlo desde un endpoint xd
    const { firstName, lastName, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isAdmin: true
    })
    res.json(user)
}





module.exports = {
    getActiveUsers,
    getActiveUserProfile,
    registerUser,
    createAdmin,
    login,
    me,
    createAdmin
}
