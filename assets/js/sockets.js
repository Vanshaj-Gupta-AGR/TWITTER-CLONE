var connected=false;



var socket = io("http://localhost:8000", {
  transports: ["websocket", "polling", "flashsocket"],
});
socket.emit("setup",user);


socket.on("connected",()=>{
   
    console.log("ndfcmrd");

})
