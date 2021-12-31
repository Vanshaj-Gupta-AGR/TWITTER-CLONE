const mongoose =require('mongoose');

const dburl="mongodb+srv://vansh_gupta:9639001475@cluster0.bv6wh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" || 'mongodb://localhost/clone_development'

mongoose.connect(dburl);

const db=mongoose.connection;

db.on('error',console.error.bind(console,"error connecting"))
db.once('open',function(){
    console.log('connected to database')
})

module.exports=db;