const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const configDB = require("../config/db");
const passport = require("passport");

router.post('/authentication', (req,res) => {
    const login = req.body.login;
    const password = req.body.password;

    User.getUserByLogin(login, (err, user) => {
        if (err) throw err;
        if (!user)
            return res.json({ success: false, message: "серв. Пользователь с таким именем не найден" });
        User.comparePass( password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), configDB.secret, {
                    expiresIn: 3600 * 24
                });
                res.json(
                    {
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email
                    },
                    message: "серв. Пользователь зарегестрирован"
                });
            } else
                return res.json({ success: false, message: "серв. Пароли не совпадают" });
        })
    });

});




router.post('/registration', (req,res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
        // password_2: req.body.password_2
    });
    User.addUser(newUser, (err, user) => {
        if(err)
            res.json({ success: false, message: "серв. Пользователь НЕ зарегестрирован" });
        else
            res.json({ success: true, message: "серв. Регистация успешна" });
    })
});

let authenticate = passport.authenticate('jwt', { session: false }, () => console.log('серв.лог  JWT worked'));
router.get(
    '/userPage',
    authenticate,
    (req,res) => {
    res.send('UserPage')
});

module.exports = router;