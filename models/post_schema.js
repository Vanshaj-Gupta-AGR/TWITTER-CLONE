const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    pinned: Boolean,
    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
 
        }
    ]
},{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;