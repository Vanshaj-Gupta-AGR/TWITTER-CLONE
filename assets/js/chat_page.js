var userlog;
var typing=false;
var lastTypingTime;
var users;
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
        markallmessagesasread();





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

socket.on("message received",(newmessage)=>{
   
   
    messageRecived(newmessage.message);
 
 })
 
 function messageRecived(newmessage){
     if($(`[data-room="${newmessage.chat._id}"]`).length==0){

     }
     else{
         addChatMessageHtml(newmessage);
     }
       refreshMessage()

 }

 function markallmessagesasread(){
     $.ajax({
         url: `/messages/${chat}/okay`,
         type: "put",
         success: ()=>{
         console.log("hi")
         refreshMessage()
      } })
 }

function getChatName(chatData,userlog){
    var chatName= chatData.chatName;
users=chatData.users;
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
$(document).on("click", (e) => {
    const target = $(e.target)
    if(target.hasClass("leaveChat")){
        if(target.data().id != null) {
            swal({
                title: "Are you sure?",
                text: "once exited you will no longer the member of this group",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        url: `/chats/leaveChat/${chat}`,
                        type: "PUT", 
                        success: () => window.location.href='/messages',
                        error: () => confirm("Could not update. Please try again")
                    })
                } else {
                  
                }
              });
        }
        return false
    }
})




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

let timer, userToAdd
 
const searchBox = $("#addNewUserModalTextBox")
const addUser = $("#addNewUserModalButton")
 
if(searchBox != null) {
    searchBox.on("keydown", function(event) {
        clearTimeout(timer);
        const textbox = $(this)
        let value = textbox.val()
    
        if (value === "" && event.keyCode === 8) {
            $(".userList").html("");
            return;
        }
    
        timer = setTimeout(() => {
            value = textbox.val().trim();
    
            if(value === "") {
                $(".userList").html("");
            }
            else {
                searchUsers(value);
            }
        }, 1000)
    })
}
 
function searchUsers(searchTerms) {
    // $.get("/api/us/sr", { search: searchTerm }, results => {
    //     outputSelectableUsers(results, $(".userList"));
    // })

    $.ajax({
        url: "/api/us/sr",
        type: "post",
        data: {obj: searchTerms},
        success: (data)=>{
            outputSelectableUsers(data.result,$(".userList"))
  
        }

    })
}
 
function outputSelectableUsers(results, container) {
    container.html("");
 
    results.forEach(result => {
        
        if(users.some(user => user._id === result._id)) {
            return;
        }
 
        const html = createUserHtml(result);
        const element = $(html);
        element.click(() => userSelected(result))
 
        container.append(element);
    });
 
}
 
function createUserHtml(userData) {
    const name = userData.name
    
    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='#'>${name}</a>
                        <span class='username'>@${userData.name}</span>
                    </div>
                </div>
            </div>`;
}
 
function userSelected(user) {
    searchBox.val(user.name).focus();
    $(".userList").html("");
    userToAdd = user
}
 
if(addUser != null) {
    addUser.on("click", () => {
        if(userToAdd == null) {
            alert("No user selected. Please try again")
            return
        }
        else {
            $.ajax({
                url: `/chats/${chat}/addNewMember`,
                data: userToAdd,
                type: "PUT", 
                success: () => location.reload(),
                error: () => confirm("Could not update. Please try again")
            })
        }
    })
}
 
$("#addNewUserModal").on("hidden.bs.modal", () => {
    searchBox.val("")
    $(".userList").html("")
    userToAdd = null
});
