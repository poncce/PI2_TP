// controller/comment.js
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");
const { registrarBitacora, nivelesCriticidad } = require('../models/hooks/bitacora');

async function addComment(req, res) {
  const { postId } = req.params;
  const autorId = req.user.id;
  const { contenido } = req.body;
  if (!contenido) return res.status(400).json({ message: "Falta el contenido del comentario" });

  const post = await Post.findByPk(postId);
  if (!post) return res.status(404).json({ message: "Post no encontrado" });

  const comentario = await Comment.create({ PostId: postId, autorId, contenido, fechaComentario: new Date() });

  await registrarBitacora(req.app?.get('db') ?? null, {
    accion: 'create',
    entidad: 'comentario',
    entidad_id: comentario.id,
    usuario_id: req.user.id,
    antes: null,
    despues: comentario.toJSON(),
    criticidad: nivelesCriticidad.contenido,
    ip: req.ip,
    user_agent: req.get('User-Agent')
  });

  res.status(201).json({ message: "Comentario agregado exitosamente", comment: comentario });
}

module.exports = {
  addComment
}
