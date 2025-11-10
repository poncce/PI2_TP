const express = require('express');
const { initDatabase, ensureTables, sequelize } = require('./config/db');

// Importar todos los modelos para asegurar que se definan
const {
  User,
  Post,
  Comment,
  Friendship,
  Calification,
  Permiso,
  Bitacora
} = require('./models');

// Controllers
const {
  getActiveUsers,
  registerUser,
  login,
  me,
  createAdmin,
  getActiveUserProfile,
} = require('./controller/user');
const { addComment } = require('./controller/comment');
const { calificatePost } = require('./controller/calification');
// const { sendFriendRequest } = require('./controller/friendship');

// Middlewares
const { isAuth, isAdmin, checkUserStatus } = require('./middlewares/auth');
const { canRatePost } = require('./middlewares/canRatePost');
const { contextMiddleware } = require('./middlewares/contextMiddleware');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getPendingRequests } = require('./controller/friendship');
const { getBitacora, getBitacoraById, limpiarBitacora, getEstadisticas } = require('./controller/bitacora');

// Controllers para posts (recetas)
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
} = require('./controller/post');

// Controllers para verificación de integridad
const {
  verificarIntegridadUsuarios,
  verificarIntegridadPosts,
  verificarRegistro,
  verificacionCompleta
} = require('./controller/integrityController');

// Importar rutas
const testRoutes = require('./routes/testRoutes');

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
server.put('/friend-request/:friendshipId/accept', isAuth, checkUserStatus, acceptFriendRequest);
server.put('/friend-request/:friendshipId/reject', isAuth, checkUserStatus, rejectFriendRequest);
server.get('/friend-requests/pending', isAuth, getPendingRequests);

// Rutas para Posts (Recetas)
server.get('/recipes', getPosts);
server.get('/recipes/search', searchPosts);
server.get('/recipes/:id', getPostById);
server.post('/recipes', isAuth, checkUserStatus, createPost);
server.put('/recipes/:id', isAuth, checkUserStatus, updatePost);
server.delete('/recipes/:id', isAuth, checkUserStatus, deletePost);

// Bitácora (solo administradores)
server.get('/bitacora', isAuth, isAdmin, getBitacora);
server.get('/bitacora/:id', isAuth, isAdmin, getBitacoraById);
server.get('/bitacora/estadisticas', isAuth, isAdmin, getEstadisticas);
server.delete('/bitacora/limpiar', isAuth, isAdmin, limpiarBitacora);

// Verificación de integridad de datos (DVH) - solo administradores
server.get('/integrity/usuarios', isAuth, isAdmin, verificarIntegridadUsuarios);
server.get('/integrity/posts', isAuth, isAdmin, verificarIntegridadPosts);
server.get('/integrity/:modelo/:id', isAuth, isAdmin, verificarRegistro);
server.get('/integrity/completa', isAuth, isAdmin, verificacionCompleta);

// Rutas de prueba
server.use('/test', testRoutes);

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