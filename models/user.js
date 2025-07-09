import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    aadhaarNum: {
        type: Number,
        required: true,
        unique: true        
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNum: {
        type: String,
        required: true,
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
    }, 
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
        require: true
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next) { //.pre is a middleware function 
    const user = this; // everytime we try to save new record it will be at first stored inside user variable

    // Hash the password only if it has been modified (or is new)
   if(!user.isModified('password')) return next(); //if not password modified got to next() therefore no hasing required
   
    try{
        // hash password generation

        // generating salt
        const salt = await bcrypt.genSalt(10); // generating salt using bcryprt library for password hashing, 10 is rounds, rounds represent how complex password will be more the rounds value increases more computational cost increases // 10 is ideal generally
        
        // hash password generation
        const hashPassword = await bcrypt.hash(user.password, salt);

        // Override the previous password with the new hashed password
        user.password = hashPassword; 
        next(); //next callback function says to the userSchema(mongoose) every operation tobe done before saving is done now you can save to database   
    
    }catch(err){
        return next(err);
    }
}) 

userSchema.method.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    }catch(err){
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;