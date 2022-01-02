const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
const dburl='mongodb://localhost/clone_development'
const port= 8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const MongoDbStore=require('connect-mongo')
const logger=require('morgan');

const flash=require('connect-flash');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy')
const sassMiddleware=require('node-sass-middleware');
const path=require('path');
const passportGoogle=require('./config/passport-google-oauth2-strategy')
const customMware=require('./config/middleware');
const MongoStore = require('connect-mongo')(session)
const env=require('./config/environment');

// app.use(sassMiddleware({
//     src: './assets/scss',
//     dest: './assets/css',
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css'
// }));



app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static(env.asset_path));
app.use(expressLayouts);

app.use(logger(env.morgan.mode, env.morgan.options));

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



app.set('view engine','ejs');
app.set('views','./views');





app.use(session({
    name: 'codeial',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    proxy: true,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoReconnect: true
     },function(err){
         console.log(err ||"connect-ok")
         
     })
    
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

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
    socket.on("notification received",(room)=>{
        socket.in(room).emit("notification received")
      
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
