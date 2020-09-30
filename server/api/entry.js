const { Router } = require('express');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Artist } = require('../models');
const router = Router();

router.get('/topArtists', async(req, res) => {
    const allArtists = await Artist.findAll({ limit: 20 });
    return res.json(allArtists);
  })

router.post('/login' , async (req, res) => {

    let myName = req.body.name ? req.body.name : null;
    let myPassword = req.body.password ? req.body.password : null;
    if(myName == null || myPassword == null){
        return res.status(400).send('no name or password in request body');
    }
    try{
        const user = await User.findOne({
            where:{name: myName}
        });

        if(user == null){
            return res.status(400).send('no such user');
        }

        if(await bcrypt.compare(myPassword, user.dataValues.password)){
            let token = jwt.sign({name: user.dataValues.name},
                process.env.JWT_SECRET,
                { expiresIn: '24h' // expires in 24 hours
                }
              );
                user.rememberToken = token;
                await user.save();
            return res.json({
                connection : true,
                token,
                name: user.dataValues.name})
        } else {
            return res.send('Incorrect password')
        }
    }catch(e){
        res.json(e.message);
    }

})

router.post('/create', async (req, res) => {
    let {id,name, email, password, preferences, createdAt,updatedAt} = req.body;
    if(!name || !email || !password || !preferences){
        return res.status(400).send('missing data in request body');
    }
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = { 
            name: req.body.name,
            email: req.body.email, 
            password: hashedPassword,
            isAdmin: req.body.isAdmin || 0,
            preferences: req.body.preferences,
            rememberToken: hashedPassword.slice(0,Math.round(hashedPassword.length/2))
            }

        const newUser = await User.create(user);
        return res.send(true);
        //return res.json({ token: newUser.rememberToken, name: newUser.name});
    }catch(e){
        res.status(500).send(e.message);
    }
  });

router.post('/nameUnique', async (req, res) => {
    if(!req.body.name){
        return res.status(400).send('no name in request body');
    }
    try{
        const userWithName = await User.findOne({where:{name:req.body.name}});
        if(userWithName == null){
            return res.send(true);
        }else{
            return res.send(false);
        }
    }catch(e){
        console.error(e.message);
        return res.status(500).send(e.message);
    }
})

router.post('/emailUnique', async (req, res) => {
    if(!req.body.email){
        return res.status(400).send('no email in request body');
    }
    try{
        const userWithEmail = await User.findOne({where:{email:req.body.email}});
        if(userWithEmail == null){
            return res.send(true);
        }else{
            return res.send(false);
        }
    }catch(e){
        console.error(e.message);
        return res.status(500).send(e.message);
    }
})

module.exports = router;