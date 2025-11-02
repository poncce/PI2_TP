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

  const friendUser = await User.findOne({ where: { username } });
  if (!friendUser) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  if (userId === friendUser.id) {
    return res.status(400).json({ message: "No puedes enviarte una solicitud de amistad a ti mismo" });
  }

  const existingFriendship = await Friendship.findOne({
    where: {
      userId: userId,
      friendId: friendUser.id
    }
  });

  if (existingFriendship) {
    return res.status(400).json({ message: "Ya existe una solicitud de amistad con este usuario" });
  }

  const friendship = await Friendship.create({
    userId: userId,
    friendId: friendUser.id,
    friendUsername: friendUser.username,
    stateRequest: 'pendiente',
    friendShipId: Date.now()
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

async function acceptFriendRequest(req, res) {
  const userId = req.user.id;
  const { friendshipId } = req.params;

  // Buscar la solicitud de amistad
  const friendship = await Friendship.findByPk(friendshipId);

  if (!friendship) {
    return res.status(404).json({ message: "Solicitud de amistad no encontrada" });
  }

  // Verificar que el usuario que acepta es el receptor (friendId)
  if (friendship.friendId !== userId) {
    return res.status(403).json({ message: "No tienes permiso para aceptar esta solicitud" });
  }

  // Verificar que la solicitud esté pendiente
  if (friendship.stateRequest !== 'pendiente') {
    return res.status(400).json({ message: "Esta solicitud ya fue procesada" });
  }

  // Guardar estado anterior para bitácora
  const antes = friendship.toJSON();

  // Actualizar el estado
  friendship.stateRequest = 'aceptado';
  await friendship.save();

  await registrarBitacora(req.app?.get('db') ?? null, {
    accion: 'update',
    entidad: 'friendship',
    entidad_id: friendship.id,
    usuario_id: req.user.id,
    antes: antes,
    despues: friendship.toJSON(),
    criticidad: nivelesCriticidad.contenido,
    ip: req.ip,
    user_agent: req.get('User-Agent')
  });

  res.json({ 
    message: "Solicitud de amistad aceptada", 
    friendship 
  });
}

async function rejectFriendRequest(req, res) {
  const userId = req.user.id;
  const { friendshipId } = req.params;

  const friendship = await Friendship.findByPk(friendshipId);

  if (!friendship) {
    return res.status(404).json({ message: "Solicitud de amistad no encontrada" });
  }

  if (friendship.friendId !== userId) {
    return res.status(403).json({ message: "No tienes permiso para rechazar esta solicitud" });
  }

  if (friendship.stateRequest !== 'pendiente') {
    return res.status(400).json({ message: "Esta solicitud ya fue procesada" });
  }

  const antes = friendship.toJSON();

  friendship.stateRequest = 'rechazado';
  await friendship.save();

  await registrarBitacora(req.app?.get('db') ?? null, {
    accion: 'update',
    entidad: 'friendship',
    entidad_id: friendship.id,
    usuario_id: req.user.id,
    antes: antes,
    despues: friendship.toJSON(),
    criticidad: nivelesCriticidad.contenido,
    ip: req.ip,
    user_agent: req.get('User-Agent')
  });

  res.json({ 
    message: "Solicitud de amistad rechazada", 
    friendship 
  });
}

async function getPendingRequests(req, res) {
  const userId = req.user.id;

  // Obtener solicitudes pendientes donde el usuario es el receptor
  const pendingRequests = await Friendship.findAll({
    where: {
      friendId: userId,
      stateRequest: 'pendiente'
    }
  });

  res.json(pendingRequests);
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests
};