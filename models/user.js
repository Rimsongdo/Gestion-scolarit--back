{const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name:String,
    username:String,
    password:String,
    profession:String,
    location:String,
    phone:Number,
})

userSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports=mongoose.model("User",userSchema)
}