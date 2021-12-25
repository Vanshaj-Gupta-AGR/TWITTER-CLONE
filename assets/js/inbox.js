

$(document).ready(()=>{
   $.ajax({
       url: '/old/oops',
       type: "post",
       success: (data)=>{

        outputChatList(data.results,data.userlog,$(".resultsContainer"));

       }
    })
   })


    
          
      
    


function outputChatList(chatlist,userlog,container){
   chatlist.forEach(chat => {
       var html=createChatHtml(chat,userlog);
       container.append(html);
       
   });

   if(chatlist.length==0){
       container.append("<span class='noResults'>Nothing to show </span>")

   }
}

function createChatHtml(chatdata,userlog){
    var chatName1=getChatName(chatdata,userlog);
    var img=getchatImageElements(chatdata,userlog);
    var latestMessage=getlatest(chatdata.latestMessage);

    var activeClass=!chatdata.latestMessage || chatdata.latestMessage.readBy.includes(userlog._id)? "": "active";

    return `<a class='resultListItem ${activeClass}' href='/messages/${chatdata._id}'>
                ${img}
            <div class="resultsDetailsContainer ellipsis">
             <span class="heading ellipsis">${chatName1}</span>
             <span class="subText  ellipsis">${latestMessage}</span>

            </div>
            </a>`
    
}

function getlatest(message){
    if(message!=null){
        var sender=message.sender;
        return `${sender.name}: ${message.content}`;
    }

    return "New Chat"
}

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

function getchatImageElements(chatData,userlog){
    var otherChatUsers= getOtherChatUsers(chatData.users,userlog);

    var groupChatClass="";
    var chatImage=getUserChatImagesElement(otherChatUsers[0]);

    if(otherChatUsers.length>1){
        groupChatClass="groupChatImage";
        chatImage+=getUserChatImagesElement(otherChatUsers[1]);
    }
    return `<div class="resultsImageContainer ${groupChatClass}">${chatImage}</div>`

}

function getUserChatImagesElement(user){
    if(!user || !user.profilePic){
        return alert("chutiya");
    }
    return `<img src="${user.profilePic}" alt="pic">`
}