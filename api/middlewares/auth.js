const jwt = require('jsonwebtoken')
const SECRET = 'misecreto'
const { User } = require("../models/User")

const isAuth = async (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) return res.status(401).json({ message: "Token no proporcionado" })

    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token inválido o expirado" })

        const user = await User.findByPk(decoded.id)
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

        req.user = user
        next()
    })
}

const isAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "No autenticado" })
    if (!req.user.isAdmin) return res.status(403).json({ message: "No tenes permisos de admin" })
    next()
}

module.exports = {
    isAuth,
    isAdmin
}
