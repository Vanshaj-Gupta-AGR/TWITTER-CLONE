const mongoose =require('mongoose');
const env=require('./environment');

const dburl="mongodb+srv://vansh_gupta:9639001475@cluster0.bv6wh.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-m2akif-shard-0&w=majority%22&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true" || `mongodb://localhost/${env.db}`

mongoose.connect(dburl);

const db=mongoose.connection;

db.on('error',console.error.bind(console,"error connecting"))
db.once('open',function(){
    console.log('connected to database')
})

module.exports=db;