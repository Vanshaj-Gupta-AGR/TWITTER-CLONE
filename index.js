const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();

const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy')
const sassMiddleware=require('node-sass-middleware');
const path=require('path');




app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name: 'codeial',
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/',require('./routes/index'))




const server=app.listen(port,function(err){
    if(err){
        console.log('error',err);
    }
    console.log('server is ruuning on port',port)
});

const io=require('socket.io')(server,{pingTimeout: 60000});

io.on("connection",(socket)=>{

    socket.on("setup",(userp)=>{
        socket.join(userp);
       
        socket.emit("connected");
       
    })

    socket.on("joinroom",(room)=>{
        console.log("room_joined")
        console.log(room);
        socket.join(room);
       
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing")
       
    })

    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing")
      
    })
    socket.on("new message",(newmessage)=>{
        console.log(newmessage.message.chat)

        var chat=newmessage.message.chat;

    
        

        if(!chat.users)return ;

        chat.users.forEach(user1 => {
            if(user1._id==newmessage.message.sender._id){
             
                
               
            }
            else{
            
            socket.in(user1._id).emit("message received",newmessage);
            }
            
        });


       
        
    })


    console.log("connected to io");
})
