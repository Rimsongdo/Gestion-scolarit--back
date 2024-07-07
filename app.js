const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const config=require('./utils/config')
const router=require('./controllers/users')
const adminRouter=require('./controllers/admins')
const loginRouter=require('./controllers/login')
const adminLogin=require('./controllers/loginAdmin')


mongoose.connect(config.MONGODB_URI)
app.use(cors())
app.use(express.json())
app.use('/api/users',router)
app.use('/api/login',loginRouter)
app.use('/api/admin',adminRouter)
app.use('/api/adminlogin',adminLogin)

   

module.exports=app