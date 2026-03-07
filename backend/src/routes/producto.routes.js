const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const authMiddleware = require('../middleware/auth.middleware');


// Protected routes — require valid JWT
// router.use(authMiddleware.verifyToken);
const upload = productoController.uploadMiddleware


// CRUD
router.get('/obtener', productoController.getAll); // list
router.get('/obtener/:id', productoController.getById); // get by id
router.get('/imagen/:id', productoController.getProductoImage); // get image
router.post('/crear', authMiddleware.verifyToken ,upload.single('imagen'), productoController.createProducto); // create
router.put('/actualizar/:id', authMiddleware.verifyToken ,upload.single('imagen'), productoController.updateProducto); // update
router.delete('/eliminar/:id', authMiddleware.verifyToken ,productoController.deleteProducto); // delete


module.exports = router;
