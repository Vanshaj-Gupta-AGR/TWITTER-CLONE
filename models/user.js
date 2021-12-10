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
    likes: [
        {
        type:  mongoose.Schema.Types.ObjectId,
        ref: ''
 
        }
    ],
    name:{
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg"
    },

    likes: [
        {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Post'
 
        }
    ],
    retweet: [
        {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Post'
 
        }
    ]
    
},{
    timestamps: true
})

const User=mongoose.model('User',userSchema);
module.exports=User;