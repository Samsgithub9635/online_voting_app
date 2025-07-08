import express from 'express';
const router = express.Router();
import User from '../models/user.js'; 
import {jwtAuthMiddleware, generateToken} from '../jwt.js' 


// POST new user that is to signup a new user
router.post('/signup', async (req, res) => {
    try {

        // Create a new user object(newUser) of User type document using Mongoose model
        const newUser = new User(req.body); //req.body: contains the data entered by the users

        // save the new user to the database and can be accessed by response
        const response = await newUser.save(); 
        
        const payload ={ // payload is created to store user id, username as user data 
            id: response.id,
            username: response.username
        }
        console.log(JSON.stringify(payload)); // logs the payload which contains user data: id, username in console just for testing
        
        // add the payload inside the generated token 
        // the generated token in jwt.js is stored inside a const variable 'token'
        const token =generateToken(payload);

        res.status(200).json({response: response, token: token});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login Route
router.post('/login', async(req, res)=>{
    try{
        // Extract username and password from request body
        const {username, password} = req.body;

        // Find the user by username
        const user = await User.findOne({username: username});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password!'});  
        } 

        // genrate Token 
        const payload ={
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error!'});
    }

});



// // GET all employees
// router.get('/', async (req, res) => {
//     try {
//         const employees = await Employees.find();
//         res.status(200).json(employees);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // GET employee by ID
// router.get('/id/:id', async (req, res) => {
//     try {
//         const employee = await Employees.findById(req.params.id);
//         if (!employee) return res.status(404).json({ message: 'Employee not found' });
//         res.json(employee);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // GET employees by work
// router.get('/work/:work', async (req, res) => {
//     try {
//         const employees = await Employees.find({ work: req.params.work.toLowerCase() });
//         res.json(employees);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // POST new employee
// router.post('/', async (req, res) => {
//     try {
//         const newEmp = new Employees(req.body);
//         await newEmp.save();
//         res.status(201).json(newEmp);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // PUT update employee by ID
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedEmp = await Employees.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!updatedEmp) return res.status(404).json({ message: 'Employee not found' });
//         res.json(updatedEmp);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // DELETE employee by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const deletedEmp = await Employees.findByIdAndDelete(req.params.id);
//         if (!deletedEmp) return res.status(404).json({ message: 'Employee not found' });
//         res.json({ message: 'Employee deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

export default router;
