var timer;
var selectedUsers=[];
$("#userSearchTextBox").keydown((event)=>{
    clearTimeout(timer);
    var textBox=$(event.target);
    var value=textBox.val();

    if(value=="" && (event.which==8 || event.keyCode==8)){
      
        selectedUsers.pop();
        updateSelectedUsersHtml();
        $(".resultsContainer").html("");

        if(selectedUsers.length==0){
            $("#createChatButton").prop("disabled",true)
        }


        return;
    }

  

    timer=setTimeout(()=>{
        value=textBox.val().trim();

        if(value==""){
            $(".resultsContainer").html("");
        }
        else{
          searchUsers(value)
        }
    },1000)

    
})

$('#createChatButton').click(()=>{
   var data=JSON.stringify(selectedUsers);
   
   $.post('/messages/chat',{users: data},chat=>{
       console.log(chat)
      window.location.href=`/messages/${chat._id}`;

   })




})

function searchUsers(searchTerm){
    $.ajax({
        url:'/api/us/sr',
        type: "post",
        data: {obj: searchTerm},
        success: (data)=>{
            console.log(data)
            outputSelectableUsers(data.result,data.user,$(".resultsContainer"))
        }


    })
}

function outputSelectableUsers(results,user, container) {
    container.html("");

    results.forEach(result => {
        
    
 
        if(result._id==user._id || selectedUsers.some(u=>
            u._id==result._id)){
        
            return ;
        }
        
        

        var html = createUserHtml(result, true);
        var element=$(html);

        element.click(()=>{
            userSelected(result);
        })

        container.append(element);
    
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>No results found</span>")
    }
}

function createUserHtml(userData, showFollowButton) {
    console.log(userData.name)

    var name = userData.name;
    var isFollowing = user.following && user.following.includes(userData._id);
    var text = isFollowing ? "Following" : "Follow"
    var buttonClass = isFollowing ? "followButton following" : "followButton"

    var followButton = "";
    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/users/profile/${userData._id}'>${name}</a>
                        <span class='username'>@${userData.name}</span>
                    </div>
                </div>
                ${followButton}
            </div>`;
}

function userSelected(user){
   selectedUsers.push(user);
   updateSelectedUsersHtml();
   $('#userSearchTextBox').val("").focus();
   $(".resultsContainer").html("");
   $("#createChatButton").prop("disabled",false)
}

function updateSelectedUsersHtml(){
        var element=[];

        selectedUsers.forEach(user=>{
            var name=user.name;
            var userElement=$(`<span class="selectedUser">${name}</span>`)
            element.push(userElement);
        })

        $(".selectedUser").remove();
        $(".selectedUsers").prepend(element)
}