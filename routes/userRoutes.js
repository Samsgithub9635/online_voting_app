import express from 'express';
const router = express.Router();
import User from '../models/user.js'; 
import {jwtAuthMiddleware, generateToken} from '../jwt.js' 


// POST route to add a user i.e. a voter/admin
router.post('/signup', async (req, res) =>{
    try{
        const data = req.body // Assuming the request body contains the User data

        // create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new person to the database
        const response = await newUser.save();
        console.log('data saved');

        // const payload =(
        //     id: response.id
        // )
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Toke");
    }catch(err){
        res.status(500).json({error: 'Tnternal Server Error'});
    }
} );


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
