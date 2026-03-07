const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');


const generateToken = require('../utils/generateToken');


exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'username y password requeridos' });


        const found = await User.findOne({ where: { username } });
        if (!found) return res.status(401).json({ message: 'Credenciales inválidas' });


        const match = await bcrypt.compare(password, found.password);
        if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });


        const token = generateToken({ id: found.id, username: found.username });


        res.json({ token, user: { id: found.id, name: found.name, username: found.username } });
    } catch (err) {
        next(err);
        console.error(err);
    }
};