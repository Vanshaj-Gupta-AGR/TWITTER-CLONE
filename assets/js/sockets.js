var connected=false;
var userlog;





var socket = io("http://localhost:8000", {
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


  }
})


