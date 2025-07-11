import express, { response } from 'express';
const router = express.Router();
import candidate from '../models/candidate.js'; 
import User from '../models/user.js';

const checkAdminRole = async (userID) =>{
    try{
        const user = await User.findById(userID);
        return user.role === 'admin';

    }catch(err){
        return false;
    }
}

// POST route to add a candidate
router.post('/', async (req, res) => {
    try {

        if(!checkAdminRole){
            return res.status(404).json({message: "User role is not equal to 'admin'!"})
        }
        // Create a new candidate object(newcandidate) of candidate type document using Mongoose model
        const newCandidate = new candidate(req.body); //req.body: contains the data entered by the candidates

        // save the new candidate to the database and can be accessed by response
        const response = await newCandidate.save(); 
        console.log('Candidate data saved!');

        res.status(200).json({response: response});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Profile password changing route
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) =>{
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