const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost/clone_development');

const db=mongoose.connection;

db.on('error',console.error.bind(console,"error connecting"))
db.once('open',function(){
    console.log('connected to database')
})

module.exports=db;