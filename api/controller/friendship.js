const { Friendship } = require("../models/friendship");
const { User } = require("../models/User");

const sendFriendRequest = async (req, res) => {
  const senderId = req.user.id;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Debes proporcionar el nombre de usuario del destinatario." });
  }

  const receiver = await User.findOne({ where: { username } });

  if (!receiver) {
    return res.status(404).json({ error: "Usuario destinatario no encontrado." });
  }

  if (receiver.id === senderId) {
    return res.status(400).json({ error: "No puedes enviarte una solicitud de amistad a ti mismo." });
  }

  const existing = await Friendship.findOne({
    where: {
      userId: senderId,
      friendId: receiver.id
    }
  });

  if (existing) {
    return res.status(409).json({ error: "Ya existe una solicitud de amistad entre estos usuarios." });
  }

  await Friendship.create({
    userId: senderId,
    friendId: receiver.id,
    friendUsername: receiver.username,
    stateRequest: 'pendiente',
    friendShipId: senderId 
  });

  res.status(201).json({ message: "Solicitud de amistad enviada con éxito." });
};

module.exports = {
  sendFriendRequest
};


