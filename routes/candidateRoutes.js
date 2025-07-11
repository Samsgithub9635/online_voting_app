import express, { response } from 'express';
const router = express.Router();
import Candidate from '../models/candidate.js'; 
import User from '../models/user.js';
import { jwtAuthMiddleware } from '../jwt.js';

const checkAdminRole = async (userID) =>{
    try{
        const user = await User.findById(userID);
        return user.role === 'admin';

    }catch(err){
        return false;
    }
}

// POST route to add a candidate
router.post('/',jwtAuthMiddleware, async (req, res) => { //added middleware to all candidate routes so that all routes are protected, only Role="admin" can access
    try {

        if(!(await checkAdminRole(req.user.id)))
            return res.status(403).json({message: "User role is not equal to 'admin'!"})

        // Create a new candidate object(newcandidate) of candidate type document using Mongoose model
        const newCandidate = new Candidate(req.body); //req.body: contains the data entered by the candidates

        // save the new candidate to the database and can be accessed by response
        const response = await newCandidate.save(); 
        console.log('Candidate data saved!');

        res.status(200).json({response: response});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Profile password changing route
router.put('/:candidateID',jwtAuthMiddleware, async (req, res) =>{ //added middleware to all candidate routes so that all routes are protected, only Role="admin" can access
    try{

        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message: "User role is not equal to 'admin'!"})
        }

        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, //Return the updated document
            runBalidators: true, // Run Mongoose validation
        });

        if(!response) {
            return res.status(404).json({error: 'Candidate not found!!!'});
        }

        console.log('Candidate Data Updated Successfully!');
        res.status(200).json({response});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

// Profile password changing route
router.delete('/:candidateID',jwtAuthMiddleware,  async (req, res) =>{ //added middleware to all candidate routes so that all routes are protected, only Role="admin" can access
    try{

        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message: "User role is not equal to 'admin'!"})
        }

        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const response = await Candidate.findByIdAndDelete(candidateID);
       
        if(!response) {
            return res.status(404).json({error: 'Candidate not found!!!'});
        }

        console.log('Candidate Data Deleted Successfully!');
        res.status(200).json({response});
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});


// add voting counts
router.post('/vote/:candidateID', jwtAuthMiddleware, async(req, res)=>{
    // no admin can vote
        // user can only vote once
        candidateID = req.params.candidateID;
        userID = req.user.id;

    try{ 

        //Find the Candidate document with specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!Candidate){ //if candidate id doesn't match send this message below
            return res.status(404).json({message: 'Candidate not found!!!'});
        }
        // Find voter by their id
        const user = await User.findById(userId);
        if(!User){ //if voter id doesn't match send this message below
            return res.status(404).json({message: 'User not found!!!'});
        }

        if(user.isVoted){
            res.status(400).json({message: 'You have already voted!'});
        }

        if(user.role == 'admin'){
            res.status(403).json({message: 'admin is not allowed to vote!!!'});
        }

        // Update the Candidate document to record the vote
        Candidate.votes.push({user: userID});
        Candidate.voteCount++;
        await candidate.save();

        // Update the user document
        user.isVoted =true
        await user.save();

        res.status(200).json({message: 'Vote recorded successfully!'});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

export default router;