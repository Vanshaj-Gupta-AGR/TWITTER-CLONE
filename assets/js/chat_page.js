var userlog;
var typing=false;
var lastTypingTime;
$(document).ready(()=>{

    socket.emit("joinroom",chat);
    socket.on("typing",()=>{
        $(".typingDots").show();
    })
    socket.on("stop typing",()=>{
        $(".typingDots").hide();
    })

    $.get(`/messages/chatname/${chat}`,(data)=>{
        
        $("#chatName").text(getChatName(data.chat[0],data.userlog));
    })

    $.get(`/messages/chatname/${chat}/message`,(data)=>{
        userlog=data.userlog
        var messages=[];
        var lastSenderId=""


        data.messages.forEach((message,index) => {
            var html=createMessageHtml(message,data.messages[index+1],lastSenderId);
            messages.push(html);

            lastSenderId=message.sender._id;
            
        });

        var messageHtml=messages.join("");

        addmessagesHtmltoPage(messageHtml);
        scrollToBottom(false);





    })
})

function addmessagesHtmltoPage(html){
    $(".chatMessages").append(html)

    //scroll to bottom

}
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

    updateTyping();

    if(event.which==13){
    messageSubmitted();
    return false;
    }


})

function updateTyping(){


    if(!typing){
        typing=true;
        socket.emit("typing",chat);

    }

    lastTypingTime=new Date().getTime();
    var timerLength=1000;

    setTimeout(()=>{

        var timeNow=new Date().getTime();
        var timeDiff=timeNow-lastTypingTime;

        if(timeDiff>=timerLength && typing){
            socket.emit("stop typing",chat);
            typing=false;

        }

    },timerLength)

}


function messageSubmitted(){
  var content=$("#inputTextbox").val().trim();

  if(content!=""){
  sendMessage(content);
  $("#inputTextbox").val("")
  socket.emit("stop typing",chat);
  typing=false;
  }
}

function sendMessage(content){
    $.post("/messages/message",{content: content,chatId: `${chat}`},(data,xhr)=>{
      

        userlog=data.userlog
        addChatMessageHtml(data.message);

        socket.emit("new message",data);
    })

}
function addChatMessageHtml(message){
    if(!message){
        return alert("message is not valid");
    }
    var messagediv=createMessageHtml(message,null,"");

    $(".chatMessages").append(messagediv);
    scrollToBottom(true)



}

socket.on("message recieved",(newmessage)=>{
   
    messageRecived(newmessage);
 
 })
 
 function messageRecived(newmessage){
     if($(".chatContainer").length==0){
 
     }
     else{
         addChatMessageHtml(newmessage);
     }
 }

function createMessageHtml(message,nextMeassage,lastSenderId){

    var sender=message.sender;
    var senderName=sender.name;

    var currentSenderId=sender._id;
    var nextSenderId=nextMeassage!=null ? nextMeassage.sender._id: "";

    var isFirst=lastSenderId!=currentSenderId;
    var isLast=nextSenderId!=currentSenderId;


    var nameElement="";


    var isMine=message.sender._id==userlog._id;
    var liClassName=isMine ? "mine" : "theirs";

    if(isFirst){
        liClassName+=" first"

        if(!isMine){
            nameElement=`<span class="senderName">${senderName}</span>`
        }

    }

    var profileImage="";


    if(isLast){
        liClassName+=" last"
        profileImage=`<img src="${sender.profilePic}">`;

    }

    var imageContainer="";

    if(!isMine){
        imageContainer=`<div class="imageContainer">
                        ${profileImage}
                        </div>`

    }

    return `<li class="message ${liClassName}">
            ${imageContainer}
            <div class="messageContainer">

            ${nameElement}

            <span class="messageBody">${message.content}</span>

            </div>

            </li>`
}

function scrollToBottom(animated){
    var container=$('.chatMessages')

    var scrollh=container[0].scrollHeight;

    if(animated){
        container.animate({scrollTop: scrollh },"slow");
    }
    else{
        container.scrollTop(scrollh);
    }

}


