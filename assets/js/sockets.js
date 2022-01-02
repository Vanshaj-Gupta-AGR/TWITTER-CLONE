var connected=false;
var userlog;

var t;


var socket = io("https://twitter-by-dev.herokuapp.com", {
  transports: ["websocket", "polling", "flashsocket"],
});

$.ajax({
  url: '/u',
  type: "get",
  success: (data)=>{
    userlog=data

  
  socket.emit("setup",userlog._id);


  socket.on("connected",()=>{
  connected=true;
   
    console.log("ndfcmrd");

})

  socket.on("notification received",(notification)=>{
    $.get('/notifications/latest',(data)=>{
      showpopup(data)
      refreshNotification();
    })
  })

  

  }
})

function emitNotification(userId){
  if(userId==userlog._id){
    return ;
  }
  

  socket.emit("notification received",userId);
}



