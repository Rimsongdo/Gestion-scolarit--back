const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const config=require('./utils/config')
const router=require('./controllers/users')
const loginRouter=require('./controllers/login')
mongoose.connect(config.MONGODB_URI)
app.use(cors())
app.use(express.json())
app.use('/api/users',router)
app.use('/api/login',loginRouter)


module.exports=app