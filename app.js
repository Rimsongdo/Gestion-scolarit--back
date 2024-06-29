const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const config=require('./utils/config')
const router=require('./controllers/users')
mongoose.connect(config.MONGODB_URI)
app.use(cors())
app.use(express.json())
app.use('/api/users',router)
app.get("/",(req,res)=>{
    res.send("Hello world")
})

module.exports=app