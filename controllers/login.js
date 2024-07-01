const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const tools = require('../utils/config');

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Vérifiez si le nom d'utilisateur et le mot de passe sont fournis
    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    const user = await User.findOne({ username });
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHashed);

    if (!(user && passwordCorrect)) {
        return res.status(401).json({ error: 'invalid username or password' });
    }

    console.log('You are connected');
    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userForToken, tools.SECRET);

    res.status(200).send({ token, username: user.username, name: user.name, id: user._id });
});

module.exports = loginRouter;
