import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userAuthSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    } , 
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null,
        unique: true,
        sparse: true
    },
    role : {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    },
    profilePicture: {
        type: String,
        default: null
    }
}, { timestamps: true })    


userAuthSchema.pre('save' , async function(){
    if(!this.isModified('password') || !this.password) return

    const hash = await bcrypt.hash(this.password , 10)
    this.password = hash
})
userAuthSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password , this.password)
}

const UserAuth = mongoose.model("User", userAuthSchema);

export default UserAuth;
