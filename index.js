const express=require('express');
const app=express();

const port=8000;

app.use('/',require('./routes/index'))

app.listen(port,function(err){
    if(err){
        console.log('error',err);
    }
    console.log('server is ruuning on port',port)
});

