import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtAuthMiddleware = (req, res, next)=>{
    try {
        // Extract the jwt token from the req header
        // jwt auth middleware
        const token = req.headers.authorization?.split(' ')[1]; // splited Bearer token use ' '(space) so that the 'bearer' keyword will be at 0th index and the actual token will be at 1st index
        if(!token) return res.status(401).json({error: 'Unauthorized' });

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //jwt.verify() used to verify the token taking the token and the secret key(JWT_SECRET) and returns the payload

        // Attach user information to the request object
        req.user = decoded.userData; //the decoded payload, want to send it to server
        next();
    } catch(err) {
        console.error(err);
        res.status(401).json({error: 'Invalid token!'});
    }
};

// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data 
    return jwt.sign({userData}, process.env.JWT_SECRET, {expiresIn: '30m'});
};

export { jwtAuthMiddleware, generateToken };