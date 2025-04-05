import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String,
         required: [true , 'User name is required'], 
         trim : true,
         minLength: 3,
         maxLength: 10,
    },
    email:{
        type: String,
        required: [true , 'Email is required'],
        unique: true,
        trim : true,
        lowercase: true,
        validate: {
            validator: (value) => {
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return value.match(regex);
            },
            message: 'Please enter a valid email address',
        },
    },
    password: {
        type: String,
        required: [true , 'Password is required'],
        minLength: 6,
        maxLength: 20,
    },
} , {
    timestamps: true,
    versionKey: false,
});


const User = mongoose.model('User', userSchema);

export default User;