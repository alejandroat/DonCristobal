const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/crear', userController.createUser); // create
// Protected routes — require valid JWT
router.use(authMiddleware.verifyToken);


// CRUD
router.get('/obtener', userController.getAll); // list
router.get('/obtener/:id', userController.getById); // get by id
router.put('/actualizar/:id', userController.updateUser); // update
router.delete('/eliminar/:id', userController.deleteUser); // delete


module.exports = router;