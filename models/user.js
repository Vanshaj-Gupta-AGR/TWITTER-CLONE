const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "/images/profilePic.png"
    }
},{
    timestamps: true
})

const User=mongoose.model('User',userSchema);
module.exports=User;