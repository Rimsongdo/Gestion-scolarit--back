const User=require('../models/user')
const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')

router.get('/',async (req,res)=>{
    try{
        const users=await User.find({})
        res.send(users)
    }
    catch(error){
        res.statut(500).json({error:"something went wrong"})
    }
})
router.post('/',async (req,res)=>{
    try{
        
        const {name,username,password,profession,location,phone}=req.body
        const saltRounds=10
        passwordHashed=await bcrypt.hash(password,saltRounds)
        const user=new User({
            name,username,passwordHashed,profession,location,phone
        })
        await user.save()
        res.json(user)
    }
    catch(error){
        res.json({error})
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { profession, location, phone } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { profession, location, phone },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports=router