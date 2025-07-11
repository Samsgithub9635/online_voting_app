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
            return res.status(403).json({message: "User role is not equal to 'admin'!"})
        }
        // Create a new candidate object(newcandidate) of candidate type document using Mongoose model
        const newCandidate = new candidate(req.body); //req.body: contains the data entered by the candidates

        // save the new candidate to the database and can be accessed by response
        const response = await newCandidate.save(); 
        console.log('Candidate data saved!');

        res.status(200).json({response: response});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Profile password changing route
router.put('/:candidateID', async (req, res) =>{
    try{

        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message: "User role is not equal to 'admin'!"})
        }

        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const updatedCandidateData = req.body;

        const response = await candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, //Return the updated document
            runBalidators: true, // Run Mongoose validation
        });

        if(!response) {
            return res.status(404).json({error: 'Candidate not found!!!'});
        }

        console.log('Candidate Data Updated Successfully!');
        res.status.apply(200).json({response});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

// Profile password changing route
router.delete('/:candidateID', async (req, res) =>{
    try{

        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message: "User role is not equal to 'admin'!"})
        }

        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const response = await candidate.findByIdAndDelete(candidateID);
       
        if(!response) {
            return res.status(404).json({error: 'Candidate not found!!!'});
        }

        console.log('Candidate Data Deleted Successfully!');
        res.status.apply(200).json({response});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

export default router;