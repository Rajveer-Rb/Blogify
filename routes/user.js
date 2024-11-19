const { Router } = require('express');
const User = require('../models/user');
const router = Router();

router.get('/signin', (req, res) => {
    return res.render("signin");
})

router.get('/signup', (req, res) => {
    return res.render("signup");
})

router.post('/signin', async (req, res) => {
    
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render('signin', {error: "incorrect username or password"});
    }
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({ message: 'Email is required' });
    }
    
    const userExists = await User.findOne({email: email});
    if(userExists) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    try {
        await User.create({
            fullname: fullName,
            email: email,
            password: password,
        });
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Signup error' });
    }
    
    
})

router.get('/logout', (req,res) => {
    res.clearCookie("token").redirect("/");
})


module.exports = router;
