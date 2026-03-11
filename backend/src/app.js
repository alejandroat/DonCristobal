const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const productoRoutes = require('./routes/producto.routes');


require('dotenv').config();


const app = express();


app.use(cors());
app.use(express.json());

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



app.get('/', (req, res) => res.json({ ok: true, message: 'API active' }));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);


// Error handler
app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});


module.exports = app;
