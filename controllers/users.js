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