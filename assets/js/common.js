$(document).ready(()=>{
})
$("#posttextarea").keyup(event=>{
    var textbox=$(event.target);
    var value=textbox.val().trim();

    var btn=$('#submitpost');

    if(value!=""){
        btn.prop('disabled',false);
        return ;
    }
    if(value==""){
        btn.prop('disabled',true);
        return ;
    }
})

$('#submitpost').click((event)=>{
    var button=$(event.target);
    var textbox=$('#posttextarea');

    

    var data={
        content: textbox.val()
       
    }
  
    $.post("/api/posts",data,(postData,status,xhr)=>{
        console.log(postData)
        var html=createPostHtml(postData);
        console.log(html);
        $('.postsContainer').prepend(html);
        textbox.val("");
        button.prop("disabled",true)



    })

})

function createPostHtml(postdata){
var by=postdata.user;



    return `<div class="post">
                <div class="mainContentContainer">
                 <div class="userImageContainer">
                  <img src="${by.profilePic}">
                  </div>
                  <div class="postContentContainer">
                    <div class="header">
                    <a class="displayname" href="/users/profile/${by._id}">${by.name}</a>
                    <span class="username">${by.name}</span>
                    <span class="date">${by._id}</span>
                    </div>
                    <div class="postBody">
                    <span>${postdata.content}</span>
                    </div>
                    <div class="postFotter">
                        <div class="postButtonContainer">
                            <button>
                              <i class='far fa-comment'></i>
                            </button>
                            

                        </div>
                        <div class="postButtonContainer">
                            <button>
                              <i class='fas fa-retweet'></i>
                            </button>
                            

                        </div>
                        <div class="postButtonContainer">
                            <button>
                              <i class='far fa-heart'></i>
                            </button>
                            

                        </div>
                    </div>
                  </div>
                </div>
                </div>`
}