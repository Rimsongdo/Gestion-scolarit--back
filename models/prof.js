const mongoose=require('mongoose')

const profSchema=new mongoose.Schema({
    name:{ type: String, required: true },
    username: { type: String, required: true, unique: true },
    passwordHashed:{ type: String, required: true },
    filiere:{type:String}
})


profSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports=mongoose.model("Prof",profSchema)
