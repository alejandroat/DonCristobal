const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const authMiddleware = require('../middleware/auth.middleware');


// Protected routes — require valid JWT
// router.use(authMiddleware.verifyToken);
const upload = categoriaController.uploadMiddleware

router.get('/obtener', categoriaController.getAll); // list
router.get('/obtener/:id', categoriaController.getById); // get by id
router.get('/imagen/:id', categoriaController.getCategoriaImage); // get image

// CRUD
router.post('/crear', authMiddleware.verifyToken ,upload.single('imagen'), categoriaController.createCategoria); // create
router.put('/actualizar/:id', authMiddleware.verifyToken ,upload.single('imagen'), categoriaController.updateCategoria); // update
router.delete('/eliminar/:id', authMiddleware.verifyToken ,categoriaController.deleteCategoria); // delete


module.exports = router;
