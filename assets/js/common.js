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

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000<30){
            return "just now";
        }
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return  Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
let user3;

$(document).on("click",".likebutton",(event)=>{
    var btn=$(event.target);

    var postId=getid(btn);

  

   $.ajax({
      url: `/api/posts/${postId}/like`,
      type: "PUT",
      success: (postdata)=>{
         btn.find('span').html(postdata.likes.length || "");
         
      
      }
     

  })
  location.reload();

   
});

function getid(element){

    var isroot=element.hasClass("post");

    var rootelement=isroot? element : element.closest(".post");

    var postid=rootelement.data().id;

    return postid;
}

function createPostHtml(postdata){
var by=postdata.user;
var timestamp=timeDifference(new Date(),new Date(postdata.createdAt));


    return `<div class="post" data-id="${postdata._id}">
                <div class="mainContentContainer">
                 <div class="userImageContainer">
                  <img src="${by.profilePic}">
                  </div>
                  <div class="postContentContainer">
                    <div class="header">
                    <a class="displayname" href="/users/profile/${by._id}">${by.name}</a>
                    <span class="username">@${by.name}</span>
                    <span class="date">${timestamp}</span>
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
                            <button class="retweet">
                              <i class='fas fa-retweet'></i>
                            </button>
                            

                        </div>
                        <div class="postButtonContainer">
                            <button class="likebutton likeButtoClass">
                              <i class='far fa-heart'></i>
                              <span>${postdata.likes.length || ""}</span>
                            </button>
                            

                        </div>
                    </div>
                  </div>
                </div>
                </div>`
}

