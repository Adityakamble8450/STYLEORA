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
        required: true
    },
    password: {
        type: String,
        required: true
    } , 
    role : {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    }
}, { timestamps: true })    


userAuthSchema.pre('save' , async function(){
    if(!this.isModified('password')) return

    const hash = await bcrypt.hash(this.password , 10)
    this.password = hash
})
userAuthSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password , this.password)
}

const UserAuth = mongoose.model("User", userAuthSchema);

export default UserAuth;
