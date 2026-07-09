import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
     required:[true, "Username is required"],
     minLength: [3, "Username Username must be at least 3 characters"],
     maxLength: [30, "Username cannot exceed more than 30 characters"],
     unique: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },
    resetPasswordToken: {
       type: String
   },
   resetPasswordExpire: {
       type: Date
 },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;