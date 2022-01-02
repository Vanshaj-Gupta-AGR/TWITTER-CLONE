const mongoose =require('mongoose');
const env=require('./environment');

const dburl="mongodb+srv://vansh_gupta:9639001475@cluster0-jjbdh.mongodb.net/somebuddy?retryWrites=true" || `mongodb://localhost/${env.db}`

mongoose.connect(dburl);

const db=mongoose.connection;

db.on('error',console.error.bind(console,"error connecting"))
db.once('open',function(){
    console.log('connected to database')
})

module.exports=db;