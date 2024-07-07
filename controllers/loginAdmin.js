const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const adminLogin = require('express').Router();
const Admin = require('../models/admin');
const tools = require('../utils/config');
const Prof=require('../models/prof');
const adminRouter = require('./admins');

const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
};

adminLogin.post('/',
    // Validation and sanitization
    [
        body('username').notEmpty().withMessage('username is required'),
        body('password').notEmpty().withMessage('password is required')
    ],
    async (req, res) => {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const user = await Admin.findOne({ username });
            const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHashed);

            if (!(user && passwordCorrect)) {
                return res.status(401).json({ error: 'invalid username or password' });
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            };

            const token = jwt.sign(userForToken, tools.SECRET, { expiresIn: '1h' });

            res.status(200).send({ token, username: user.username, name: user.name, id: user._id });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

adminLogin.post('/student',
    [
        // Validation and sanitization
        body('name').notEmpty().withMessage('name is required'),
        body('username').notEmpty().withMessage('username is required'),
        body('password').isLength({ min: 5 }).withMessage('password must be at least 5 characters long'),
        body('filiere').notEmpty().withMessage('filiere is required'),
        body('carteID').notEmpty().withMessage('carteID is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const token = getTokenFrom(req);
            if (!token) {
                return res.status(401).json({ error: 'token missing or invalid' });
            }

            const decodedToken = jwt.verify(token, tools.SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return res.status(401).json({ error: 'admin not found' });
            }

            const { name, username, password, filiere, carteID } = req.body;
            const saltRounds = 10;
            const passwordHashed = await bcrypt.hash(password, saltRounds);

            const user = new User({
                name,
                username,
                passwordHashed,
                filiere,
                carteID
            });

            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

adminLogin.delete('/student/:username',
    async (req, res) => {
        try {
            const token = getTokenFrom(req);
            if (!token) {
                return res.status(401).json({ error: 'token missing or invalid' });
            }

            const decodedToken = jwt.verify(token, tools.SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return res.status(401).json({ error: 'admin not found' });
            }

            const username = req.params.username;
            const user = await User.findOneAndDelete({ username });

            if (!user) {
                return res.status(404).json({ error: 'user not found' });
            }

            res.status(204).end(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);


adminLogin.post('/manager',
    [
       
        body('name').notEmpty().withMessage('name is required'),
        body('username').notEmpty().withMessage('username is required'),
        body('password').isLength({ min: 5 }).withMessage('password must be at least 5 characters long'),
        body('filiere').notEmpty().withMessage('filiere is required')
       
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const token = getTokenFrom(req);
            if (!token) {
                return res.status(401).json({ error: 'token missing or invalid' });
            }

            const decodedToken = jwt.verify(token, tools.SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return res.status(401).json({ error: 'admin not found' });
            }

            const { name, username, password, filiere } = req.body;
            const saltRounds = 12;
            const passwordHashed = await bcrypt.hash(password, saltRounds);

            const prof = new Prof({
                name,
                username,
                passwordHashed,
                filiere
                
            });

            await prof.save();
            res.status(201).json(prof);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);
adminLogin.delete('/manager/:username',
    async (req, res) => {
        try {
            const token = getTokenFrom(req);
            if (!token) {
                return res.status(401).json({ error: 'token missing or invalid' });
            }

            const decodedToken = jwt.verify(token, tools.SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return res.status(401).json({ error: 'admin not found' });
            }

            const username = req.params.username;
            const prof = await Prof.findOneAndDelete({ username });

            if (!prof) {
                return res.status(404).json({ error: 'user not found' });
            }

            res.status(204).end(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);


adminLogin.get('/:username', async (req, res) => {
    try{
        const token = getTokenFrom(req);
            if (!token) {
                return res.status(401).json({ error: 'token missing or invalid' });
            }

            const decodedToken = jwt.verify(token, tools.SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return res.status(401).json({ error: 'admin not found' });
            }
        const { username } = req.params;
        const manager = await Prof.findOne({ username });
        if (manager) {
            res.json(manager);
        } else {
            res.status(404).send({ error: 'Manager not found' });
        }
    }
    catch(e){
        console.log(e)
    }
    
});

adminLogin.put('/:usern', async (req, res) => {
    const { usern } = req.params;
    const { name, username,filiere } = req.body;

    try {
        const token = getTokenFrom(req);
            if (!token) {
                return res.status(401).json({ error: 'token missing or invalid' });
            }

            const decodedToken = jwt.verify(token, tools.SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return res.status(401).json({ error: 'admin not found' });
            }
        const user = await Prof.findOne({ username: usern });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (name) user.name = name;
        if (username) user.username = username;
        if (filiere) user.filiere = filiere;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});


adminLogin.get('/student/:username', async (req, res) => {
    try{
        const token = getTokenFrom(req);
            if (!token) {
                return res.status(401).json({ error: 'token missing or invalid' });
            }

            const decodedToken = jwt.verify(token, tools.SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return res.status(401).json({ error: 'admin not found' });
            }
        const { username } = req.params;
        const manager = await User.findOne({ username });
        if (manager) {
            res.json(manager);
        } else {
            res.status(404).send({ error: 'Manager not found' });
        }
    }
    catch(e){
        console.log(e)
    }
    
});

adminLogin.put('/student/:usern', async (req, res) => {
    const { usern } = req.params;
    const { name, username,filiere,carteID } = req.body;

    try {
        const token = getTokenFrom(req);
            if (!token) {
                return res.status(401).json({ error: 'token missing or invalid' });
            }

            const decodedToken = jwt.verify(token, tools.SECRET);
            if (!decodedToken.id) {
                return res.status(401).json({ error: 'token invalid' });
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return res.status(401).json({ error: 'admin not found' });
            }
        const user = await User.findOne({ username: usern });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (name) user.name = name;
        if (username) user.username = username;
        if (filiere) user.filiere = filiere;
        if (carteID) user.carteID= carteID;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

 
module.exports = adminLogin;
