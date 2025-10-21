// index
const express = require('express');
const { sayHello } = require('./controller/sayHello');
const { getActiveUsers, registerUser, login, me, createAdmin, getActiveUserProfile,} = require('./controller/user');
const { isAuth, isAdmin } = require('./middlewares/auth');


const { sequelize } = require('./config/db');
const { canRatePost } = require('./middlewares/canRatePost');
const { checkUserStatus } = require('./middlewares/checkUserStatus');
const { isOwnerOfComment } = require('./middlewares/isOwnerOfComment');
const { isOwnerOfPost } = require('./middlewares/isOwnerOfPost');
const server = express();

server.use(express.json())
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});



server.get('/', sayHello)
server.get('/users', isAuth, getActiveUsers)
server.get('/me', isAuth, me)
server.post('/users', registerUser)
server.post('/login', login)
server.post('/admin/create', createAdmin)   // checkear con malcos




server.listen(3000, async () => {
    await sequelize.sync({ force: false })
    console.log('El server se esta ejecutando en el puerto 3000');

})


