// controller/post.js
const { Post } = require('../models/Post');
const { registrarBitacora, nivelesCriticidad } = require('../models/hooks/bitacora');

const createPost = async (req, res) => {
  const autorId = req.user.id;
  const { titulo, contenido } = req.body;
  if (!titulo || !contenido) return res.status(400).json({ message: 'Faltan datos requeridos: titulo y contenido' });

  const newPost = await Post.create({ autorId, titulo, contenido, fechaPublicacion: new Date() });

  await registrarBitacora(req.app?.get('db') ?? null, {
    accion: 'create',
    entidad: 'post',
    entidad_id: newPost.id,
    usuario_id: req.user.id,
    antes: null,
    despues: newPost.toJSON(),
    criticidad: nivelesCriticidad.contenido,
    ip: req.ip,
    user_agent: req.get('User-Agent')
  });

  res.status(201).json({ message: 'Post creado exitosamente', post: newPost });
};

module.exports = { createPost };
