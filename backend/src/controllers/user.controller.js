const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.getAll = async (req, res, next) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username', 'createdAt', 'updatedAt'] });
        console.log(users);
        res.json(users);
    } catch (err) {
        next(err);
        console.error(err);
    }
};


exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: ['id', 'username'] });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        console.log(user);
        res.json(user);
    } catch (err) {
        next(err);
        console.error(err);
    }
};


exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        const found = await User.findByPk(id);
        if (!found) return res.status(404).json({ message: 'Usuario no encontrado' });
        if (username && username !== found.username) {
            const exists = await User.findOne({ where: { username } });
            if (exists) return res.status(409).json({ message: 'Username existente' });
            found.username = username;
        }
        if (password) found.password = await bcrypt.hash(password, 10);
        await found.save();
        res.json({ id: found.id, username: found.username });
        console.log(found);
    } catch (err) {
        next(err);
        console.error(err);
    }
};


exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const found = await User.findByPk(id);
        if (!found) return res.status(404).json({ message: 'Usuario no encontrado' });


        await found.destroy();
        res.json({ message: 'Usuario eliminado' });
        console.log(`Usuario con id ${id} eliminado`);
    } catch (err) {
        next(err);
        console.error(err);
    }
};


exports.createUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'username y password requeridos' });

        const exists = await User.findOne({ where: { username } });
        if (exists) return res.status(409).json({ message: 'Username existente' });

        const hashed = await bcrypt.hash(password, 10);

        const created = await User.create({ username, password: hashed });
        console.log(created);
        return res.status(201).json({ id: created.id, username: created.username });

    } catch (err) {
        next(err);
        console.error(err);
    }
};