const Prof=require('../models/prof')
const express=require('express')
const profRouter=express.Router()
const bcrypt=require('bcrypt')

profRouter.get('/',async (req,res)=>{
    try{
        const profs=await Prof.find({})
        res.send(profs)
    }
    catch(error){ 
        res.statut(500).json({error:"something went wrong"})
    }
})


profRouter.post('/',async (req,res)=>{
    const { name, username, password, filiere } = req.body;
            const saltRounds = 12;
            const passwordHashed = await bcrypt.hash(password, saltRounds);

            const prof = new Prof({
                name,
                username,
                passwordHashed,
                filiere
                
            });

            await prof.save();
            res.status(201).json(prof);
      
    }


   
            
);



/*
profRouter.put('/:id', async (req, res) => {
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
});*/



module.exports=profRouter