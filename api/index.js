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

const server = express();
server.use(express.json());

// Agregar sequelize al locals para que esté disponible en los middlewares
server.locals.sequelize = sequelize;

// Middleware de contexto para bitácora (debe ir después de express.json y antes de las rutas)
server.use(contextMiddleware);

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

// Ruta de prueba para bitácora (temporal)
server.post('/test-bitacora', async (req, res) => {
  try {
    // Simular una operación para probar la bitácora
    const testUser = await User.create({
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@test.com`,
      password: 'test123',
      estado: 'activo'
    }, {
      context: {
        usuario_id: 1, // Simular usuario 1
        ip: req.ip,
        user_agent: req.get('User-Agent')
      }
    });

    res.json({
      message: 'Usuario de prueba creado',
      user: testUser,
      bitacoraNote: 'Esta operación debería haberse registrado en la bitácora'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function startServer() {
  try {
    const sequelize = await initDatabase();
    console.log('Base de datos conectada');

    // Configuración de sincronización - Cambiar entre true/false según necesites
    const FORCED_SYNC = false; // true = borra todo y recrea, false = mantiene datos existentes

    // Sincronizar todos los modelos
    if (FORCED_SYNC) {
      console.log('🔄 Recreando todas las tablas desde cero (FORCED_SYNC = true)...');
      await sequelize.sync({ force: true });
      console.log('✅ Tablas recreadas correctamente');
    } else {
      console.log('🔄 Sincronizando tablas sin borrar datos (FORCED_SYNC = false)...');
      await sequelize.sync({ force: false });
      console.log('✅ Tablas sincronizadas correctamente');
    }

    // Verificar que la tabla Bitacora exista
    try {
      await Bitacora.sync({ alter: false });
    } catch (error) {
      // Error silencioso al sincronizar Bitacora
    }

    // Forzar creación de tabla Comentarios por separado
    try {
      const { Comment } = require('./models');
      await Comment.sync({ force: false });
    } catch (error) {
      // Error silencioso al sincronizar Comentarios
    }

    server.listen(3000, () => {
      console.log('🚀 Servidor corriendo en http://localhost:3000');
      console.log('📊 Sistema de bitácora activo');
    });
  } catch (error) {
    console.error('✗ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();