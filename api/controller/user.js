// api/controller/user.js
const jwt = require('jsonwebtoken');
const SECRET = 'misecreto';

async function registerUser(req, res) {
  try {
    const db = req.app.get('db');
    if (!db || !db.User) return res.status(500).json({ error: 'DB no inicializada' });

    const { username, password, email } = req.body;
    if (!username || !password || !email) return res.status(400).json({ error: 'Faltan campos' });

    const existing = await db.User.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: 'Usuario ya existe' });

    const user = await db.User.create({ username, password, email });
    return res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    console.error('registerUser error', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

async function login(req, res) {
  try {
    const db = req.app.get('db');
    if (!db || !db.User) return res.status(500).json({ error: 'DB no inicializada' });

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Faltan campos' });

    const user = await db.User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = typeof user.comparePassword === 'function'
      ? await user.comparePassword(password)
      : user.password === password;

    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

async function me(req, res) {
  try {
    const db = req.app.get('db');
    const user = await db.User.findByPk(req.user.id, { attributes: ['id', 'username', 'email'] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json(user);
  } catch (err) {
    console.error('me error', err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

async function getActiveUsers(req, res) {
  const db = req.app.get('db');
  const users = await db.User.findAll({ where: { active: true }, attributes: ['id', 'username', 'email'] });
  return res.json(users);
}

module.exports = {
  getActiveUsers,
  registerUser,
  login,
  me,
  createAdmin: async (req, res) => res.status(501).json({ error: 'No implementado' }),
  getActiveUserProfile: async (req, res) => res.status(501).json({ error: 'No implementado' })
};
