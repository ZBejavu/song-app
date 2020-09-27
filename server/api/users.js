const { Router } = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = Router();

router.post('/', async (req, res) => {
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

router.delete("/:name/:token" , async (req, res) => {
    try{
        await User.destroy({
            where: {
                name: req.params.name,
                rememberToken: req.params.token
            }
        })
        res.send('deletion success');
    }catch(e){
        res.status(500).send(e.message);
    }
})

router.put("/:name/:token" , async (req, res) => {
    try{
        await User.restore({
            where: {
                name: req.params.name,
                rememberToken: req.params.token
            }
        });
        res.send('restore success');
    }catch(e){
        res.status(500).json(e.message);
    }
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
            return res.json({connection : true, token: user.dataValues.rememberToken, name: user.dataValues.name})
        } else {
            return res.send('Incorrect password')
        }
    }catch(e){
        res.json(e.message);
    }

    // mysqlCon.query(query, async (error, results, fields) => {
    //     if (error) {
    //         console.error(error);
    //         return res.send(error.message);
    //     };
    //     if(results.length === 0){
    //         return res.send('Cannot find User');
    //     }
    //         try{
            //    if(await bcrypt.compare(myPassword, results[0].password)){
            //        res.json({"connection" : true, "token":`${results[0].remember_token}`})
            //    } else {
            //        res.send('Incorrect password')
            //    }
    //         } catch {
    //             res.status(500).send();
    //         }
    //   });
})

router.post('/validUser', async (req, res) => {
    let myToken = req.body.token ? req.body.token : null;
    let myUsername = req.body.name ? req.body.name : null;
    if(myToken === null){
        console.log('something wrong')
        return res.status(400).send('no token in request body');
    }
    if(myUsername === null){
        console.log('something wrong')
        return res.status(400).send('no user in request body');
    }
    try{
        const user = await User.findOne({
            where:{rememberToken:myToken, name:myUsername}
        })
        if(user == null){
            return res.send(false);
        }
        return res.send(true);
    }catch(e){
        res.status(500).send(e.message);
    }
})

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