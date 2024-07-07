{const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name:{ type: String, required: true },
    username: { type: String, required: true, unique: true },
    passwordHashed:{ type: String, required: true },
    filiere:{ type: String, required: true },
    carteID:{ type: String, required: true,unique:true },
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