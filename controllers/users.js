const User=require('../models/user')
const express=require('express')
const router=express.Router()

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
        const user=new User({
            name,username,password,profession,location,phone
        })
        await user.save()
    }
    catch(error){
        res.json({error})
    }
})

module.exports=router