import express, { response } from 'express';
const router = express.Router();
import User from '../models/user.js'; 
import {jwtAuthMiddleware, generateToken} from '../jwt.js'; 


// POST new user that is to signup a new user
router.post('/signup', async (req, res) => {
    try {
        // Create a new user object(newUser) of User type document using Mongoose model
        const newUser = new User(req.body); //req.body: contains the data entered by the users

        // save the new user to the database and can be accessed by response
        const response = await newUser.save(); 

        const payload = {
            id: response.id
        };
        console.log(JSON.stringify(payload)); // logs the payload which contains user data: id, username in console just for testing

        const token = generateToken(payload);

        res.status(200).json({response: response, token: token});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login Route
router.post('/login', async(req, res)=>{
    try{
        const {aadharCardNumber, password} = req.body;
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid aadharCardNumber or password!'});  
        }

        const payload ={
            id: user.id
        };
        const token = generateToken(payload);

        res.status(200).json({ token: token });

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

// Profile Route this is a protected route (jwtAuthMiddleware) used
router.get('/profile', jwtAuthMiddleware, async (req, res) =>{
    try{
        const userData = req.user; // comes from line num 14 in jwt.js //extracts user data from payload
        const userId = userData.id; // this id is extracted from the payload
        const user = await User.findById(userId);

        res.status(200).json({user});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

// Profile password changing route
router.put('/profile/password', jwtAuthMiddleware, async (req, res) =>{
    try{
        const userId = req.user.id;
        const {currentPassword, newPassword} = req.body;

        const user = await User.findById(userId);

        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Incorrect current password!!!'});
        }

        user.password = newPassword;
        await user.save();

        console.log('Password Updated successfully');
        res.status(200).json({message: "password updated"});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }
});

export default router;