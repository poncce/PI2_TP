// controller/friendship.js
const { Friendship } = require("../models/friendship");
const { User } = require("../models/User");
const { registrarBitacora, nivelesCriticidad } = require('../models/hooks/bitacora');

async function sendFriendRequest(req, res) {
  const userId = req.user.id;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Falta el username del usuario" });
  }

  // Buscar el usuario receptor por username
  const friendUser = await Usuario.findOne({ where: { username } });
  if (!friendUser) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Verificar que no se envíe solicitud a sí mismo
  if (userId === friendUser.id) {
    return res.status(400).json({ message: "No puedes enviarte una solicitud de amistad a ti mismo" });
  }

  // Verificar si ya existe una solicitud
  const existingFriendship = await Friendship.findOne({
    where: {
      user_id: userId,
      friend_id: friendUser.id
    }
  });

  if (existingFriendship) {
    return res.status(400).json({ message: "Ya existe una solicitud de amistad con este usuario" });
  }

  // Crear la solicitud de amistad
  const friendship = await Friendship.create({
    user_id: userId,
    friend_id: friendUser.id,
    status: 'pending'
  });

  await registrarBitacora(req.app?.get('db') ?? null, {
    accion: 'create',
    entidad: 'friendship',
    entidad_id: friendship.id,
    usuario_id: req.user.id,
    antes: null,
    despues: friendship.toJSON(),
    criticidad: nivelesCriticidad.contenido,
    ip: req.ip,
    user_agent: req.get('User-Agent')
  });

  res.status(201).json({ 
    message: "Solicitud de amistad enviada exitosamente", 
    friendship 
  });
}

module.exports = {
  sendFriendRequest
};