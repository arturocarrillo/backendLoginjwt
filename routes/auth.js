const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Hash password
const bcrypt = require('bcrypt');
// validation
const Joi = require('@hapi/joi');

//Schema register in db 
const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

//Schema register in login 
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

router.post('/login', async(req, res) => {
    // validaciones
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'contraseña no válida' })

    /* create token */
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET)

    res.json({
        error: null,
        data: 'exito bienvenido',
        token: token
    })

})

router.post('/register', async(req, res) => {

    // validate user
    const { error } = schemaRegister.validate(req.body)

    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    //Validate email (only)
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.status(400).json({ error: true, mensaje: 'Email ya registrado' })
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //send data
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    });
    try {
        const userDB = await user.save();
        res.json({
            error: null,
            data: userDB
        })
    } catch (error) {
        res.status(400).json({ error })
    }
})

module.exports = router;