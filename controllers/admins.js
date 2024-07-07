const express=require('express')
const Admin=require('../models/admin')
const adminRouter=express.Router()
const User=require('../models/user')
const bcrypt=require('bcrypt') 
const jwt=require('jsonwebtoken')


adminRouter.get('/',async (req,res)=>{
    try{
        const admins=await Admin.find({})
        res.send(admins)
    }
    catch(exception)
    {
        res.status(500).json(exception)
        console.log("Impossible to fetch the admins")
    }
})

adminRouter.post('/',async (req,res)=>{
    try{
       const {username,email,password,fullName,role}=req.body
       const saltRound=10
       passwordHashed=await bcrypt.hash(password,saltRound) 
       const admin=new Admin({
        username,email,passwordHashed,fullName,role
       }) 
        await admin.save()
        res.json(admin)
    }
    catch(exception)
    {
        res.status(500).json(exception)
        console.log("Impossible to add an Admin")
    }
})



module.exports=adminRouter