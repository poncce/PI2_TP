const express = require('express');
const { initDatabase, ensureTables } = require('./config/db');

// Controllers
const { 
  getActiveUsers,
  registerUser,
  login,
  me,
  createAdmin,
  getActiveUserProfile,
} = require('./controller/user');
const { createPost } = require('./controller/post');
const { addComment } = require('./controller/comment');
const { calificatePost } = require('./controller/calification');
// const { sendFriendRequest } = require('./controller/friendship');

// Middlewares
const { isAuth, isAdmin } = require('./middlewares/auth');
const { checkUserStatus } = require('./middlewares/checkUserStatus');
const { canRatePost } = require('./middlewares/canRatePost');
const { sendFriendRequest } = require('./controller/friendship');

const server = express();
server.use(express.json());

// CORS para vite
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Usuarios / Auth
server.get('/users', isAuth, getActiveUsers);
server.get('/me', isAuth, me);
server.get('/users/profile', isAuth, getActiveUserProfile);

server.post('/users', registerUser);
server.post('/login', login);
server.post('/admin/create', createAdmin);

// Posts
server.post('/posts', isAuth, checkUserStatus, createPost);

// Comentarios
server.post('/posts/:postId/comments', isAuth, checkUserStatus, addComment);

// Calificar
server.post('/posts/:postId/calification', isAuth, canRatePost, calificatePost);

// Amistad
 server.post('/friend-request', isAuth, checkUserStatus, sendFriendRequest);

 

async function startServer() {
  try {
    const sequelize = await initDatabase();
    console.log('Base de datos conectada');


    await sequelize.sync({ force: false });
    console.log('Tablas sincronizadas');

    server.listen(3000, () => {
      console.log('El server se está ejecutando en el puerto 3000');
    });
  } catch (error) {
    console.error('✗ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();