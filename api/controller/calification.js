const { Calification } = require("../models/Calification");

const calificatePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { score } = req.body;

  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ error: "La puntuación debe estar entre 1 y 5." });
  }

  const existing = await Calification.findOne({
    where: { userId, postId }
  });

  if (existing) {
    existing.score = score;
    await existing.save();
    return res.status(200).json({ message: "Calificación actualizada con éxito", postId, userId, score });
  }

  await Calification.create({ userId, postId, score });
  res.status(201).json({ message: "Post calificado con éxito", postId, userId, score });
};

module.exports = {
  calificatePost
};
