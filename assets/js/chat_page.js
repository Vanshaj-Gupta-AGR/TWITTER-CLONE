$(document).ready(()=>{
    $.get(`/messages/chatname/${chat}`,(data)=>{
        
        $("#chatName").text(getChatName(data.chat[0],data.userlog));
    })
})


$("#chatNameButton").click(()=>{
    var name=$("#chatNameTextbox").val().trim();
    
    $.ajax({
        url: `/messages/chatname/${chat}`,
        type: "put",
        data: {chatName: name},
        success: (data,status,xhr)=>{
            if(xhr.status!=200){
                return alert('chutiya');
            }

            else{
                location.reload();
            }
        }

    })
})

function getChatName(chatData,userlog){
    var chatName= chatData.chatName;

    if(!chatName){
        var otherChatUsers= getOtherChatUsers(chatData.users,userlog);
        var namesArray=otherChatUsers.map(user1=>{
            return user1.name;
        })
        chatName=namesArray.join(", ")

    }
    return chatName;
}
function getOtherChatUsers(users,userlog){
    if(users.length==1)return users;

    return users.filter((user1)=>{
        return user1._id!=userlog._id;
    })
}
$("#chatNameModal").on("show.bs.modal", function(){
    $("#chatNameTextbox").val("");
});

$(".sendMessageButton").click(()=>{
    messageSubmitted()


})
$("#inputTextbox").keydown((event)=>{

    if(event.which==13){
    messageSubmitted();
    return false;
    }


})

function messageSubmitted(){
  var content=$("#inputTextbox").val().trim();

  if(content!=""){
  sendMessage(content);
  $("#inputTextbox").val("")
  }
}

function sendMessage(content){
    $.post("/messages/message",{content: content,chatId: `${chat}`},(data)=>{
        console.log(data);
    })

}
