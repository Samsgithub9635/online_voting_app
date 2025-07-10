import express, { response } from 'express';
const router = express.Router();
import candidate from '../models/candidate.js'; 
import {jwtAuthMiddleware, generateToken} from '../jwt.js'; 


// Profile Route this is a protected route (jwtAuthMiddleware) used
router.get('/profile', jwtAuthMiddleware, async (req, res) =>{
    try{
        const candidateData = req.candidate; // comes from line num 14 in jwt.js //extracts candidate data from payload
        const candidateId = candidateData.id; // this id is extracted from the payload
        const candidate = await candidate.findById(candidateId);

        res.status(200).json({candidate});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

// Profile password changing route
router.put('/profile/password', jwtAuthMiddleware, async (req, res) =>{
    try{
        const candidateId = req.candidate.id;
        const {currentPassword, newPassword} = req.body;

        const candidate = await candidate.findById(candidateId);

        if(!(await candidate.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Incorrect current password!!!'});
        }

        candidate.password = newPassword;
        await candidate.save();

        console.log('Password Updated successfully');
        res.status(200).json({message: "password updated"});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

export default router;