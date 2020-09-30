const { Router } = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = Router();

router.delete("/:name" , async (req, res) => {
    try{
        await User.destroy({
            where: {
                name: req.params.name,
                //rememberToken: req.params.token
            }
        })
        res.send('deletion success');
    }catch(e){
        res.status(500).send(e.message);
    }
})

router.put("/:name" , async (req, res) => {
    try{
        await User.restore({
            where: {
                name: req.params.name,
                //rememberToken: req.params.token
            }
        });
        res.send('restore success');
    }catch(e){
        res.status(500).json(e.message);
    }
})

router.post('/validUser', async (req, res) => {
    console.log(req.decoded);
    res.send(true);
    // let myToken = req.body.token ? req.body.token : null;
    // let myUsername = req.body.name ? req.body.name : null;
    // if(myToken === null){
    //     console.log('something wrong')
    //     return res.status(400).send('no token in request body');
    // }
    // if(myUsername === null){
    //     console.log('something wrong')
    //     return res.status(400).send('no user in request body');
    // }
    // try{
    //     const user = await User.findOne({
    //         where:{rememberToken:myToken, name:myUsername}
    //     })
    //     if(user == null){
    //         return res.send(false);
    //     }
    //     return res.send(true);
    // }catch(e){
    //     res.status(500).send(e.message);
    // }
})

module.exports = router;