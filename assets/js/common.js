$(document).ready(()=>{
    refreshMessage();
    refreshNotification();
})

$("#posttextarea, #replytextarea").keyup(event=>{
    var textbox=$(event.target);
    var value=textbox.val().trim();

    var isModal=textbox.parents(".modal").length == 1;

    



    var btn=isModal ? $("#submitReplyButton") : $('#submitpost');

    if(value!=""){
        btn.prop('disabled',false);
        return ;
    }
    if(value==""){
        btn.prop('disabled',true);
        return ;
    }
})



$('#submitpost, #submitReplyButton').click((event)=>{
    var button=$(event.target);
    var isModal=button.parents(".modal").length == 1;
    var textbox=isModal ? $("#replytextarea"): $('#posttextarea');

    

    var data={
        content: textbox.val()
       
    }

    var t="";

    if(isModal){
        t=button.data().id;
        data.replyTo=t

    }
  
    $.post("/api/posts",data,(postData,status,xhr)=>{
        if(postData.replyTo){
            emitNotification(postData.replyTo.user)
            location.reload();
        }
        else{
        console.log(postData)
        var html=createPostHtml(postData);
       
        $('.postsContainer').prepend(html);
        textbox.val("");
        button.prop("disabled",true)

        }

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
 $("#replyModal").on("show.bs.modal",(event)=>{
    var btn=$(event.relatedTarget);

    var postId=getid(btn);

    $('#submitReplyButton').data("id",postId);

    $.get("/api/posts/" + postId,(results)=>{
      output(results,$("#originalPost"))

    })


 })

 $("#deletePostModal").on("show.bs.modal",(event)=>{
    var btn=$(event.relatedTarget);

    var postId=getid(btn);
    console.log(postId)

    $('#deletePostButton').data("id",postId);

 })
 $("#confirmPinModal").on("show.bs.modal",(event)=>{
    var btn=$(event.relatedTarget);

    var postId=getid(btn);

    $('#confirmPinButton').data("id",postId);

 })
 $("#unpinModal").on("show.bs.modal",(event)=>{
    var btn=$(event.relatedTarget);

    var postId=getid(btn);

    $('#unpinButton').data("id",postId);

 })

 $("#deletePostButton").click((event)=>{
     var postId=$(event.target).data("id");

     $.ajax({
        url: `/api/posts/${postId}`,
        type: "delete",
        success: ()=>{
            location.reload();
        //   btn.find('span').text(postdata.likes.length || "");
           
        //   if(postdata.likes.includes(user)){
        //       btn.addClass("active");
        //   }
        //   else{
        //       btn.removeClass("active");
        //   }
           
        
        }
       
  
    })

     


 })

 $("#confirmPinButton").click((event)=>{
    var postId=$(event.target).data("id");

    $.ajax({
       url: `/api/posts/${postId}/pin`,
       type: "put",
       data: {pinned: true},
       success: ()=>{
           location.reload();
     
       
       }
      
 
   })

    


})

$("#unpinButton").click((event)=>{
    var postId=$(event.target).data("id");

    $.ajax({
       url: `/api/posts/${postId}/unpin`,
       type: "put",
       data: {pinned: false},
       success: ()=>{
           location.reload();
     
       
       }
      
 
   })

    


})




 $("#replyModal").on("hidden.bs.modal",(event)=>{
    $("#originalPost").html="";



 })

let user3;

$(document).on("click",".likebutton",(event)=>{
    var btn=$(event.target);

    var postId=getid(btn);

  

   $.ajax({
      url: `/api/posts/${postId}/like`,
      type: "PUT",
      success: (postdata)=>{
        btn.find('span').text(postdata.likes.length || "");
         
        if(postdata.likes.includes(user)){
            btn.addClass("active");
            emitNotification(postdata.user)
        }
        else{
            btn.removeClass("active");
        }
         
      
      }
     

  })
 

   
});
function output(result,container){
    container.html("");

    if(!(Array.isArray(result))){
        result=[result];
    }

    result.forEach(element => {
        var html=createPostHtml(element);
        container.append(html);


    });
}
$(document).on("click",".retweetbutton",(event)=>{
    var btn=$(event.target);

    var postId=getid(btn);

  

   $.ajax({
      url: `/api/posts/${postId}/retweet`,
      type: "POST",
      success: (postdata)=>{
        console.log(postdata);

        btn.find('span').text(postdata.retweetUsers.length || "");

        if(postdata.retweetUsers.includes(user)){
            btn.addClass("active");
            emitNotification(postdata.user)
        }
        else{
            btn.removeClass("active");
        }
         
      
      }
     

  })
  

   
});




function getid(element){

    var isroot=element.hasClass("post");

    var rootelement=isroot? element : element.closest(".post");

    console.log(rootelement)
   
    var postid=rootelement.data().id;

    return postid;
}

function refreshMessage(){
    console.log("okay5")
    $.post('/old/oops',{unreadOnly: true},(data)=>{
       var numresults=data.results.length;

       if(numresults>0){
           $("#messagesBadge").text(numresults).addClass("active");

       }
       else{
           $("#messagesBadge").text("").removeClass("active")
       }
    })
}



function refreshNotification(){
    $.get('/notifications/getall',{unreadOnly: true},(data)=>{
       var numresults=data.length;

       if(numresults>0){
           $("#notificationBadge").text(numresults).addClass("active");

       }
       else{
           $("#notificationBadge").text("").removeClass("active")
       }
    })
}




function createPostHtml(postdata){

    if(postdata==null){
        return alert("fuck you");
    }

   

    var isretweet=postdata.retweetData!=undefined;
    var retweetedby=isretweet ? postdata.user.name: null;

    postdata=isretweet ? postdata.retweetData : postdata;

  


    

var by=postdata.user;



if(by._id==undefined){
    return console.log('why the fuck are you here');
}

var timestamp=timeDifference(new Date(),new Date(postdata.createdAt));
var likeButtonActiveClass=postdata.retweetUsers.includes(user)? "active":"";
var likeButtonActiveClass2=postdata.likes.includes(user)? "active":"";

var retweetText='';

if(isretweet){
    retweetText=`<span> Retweeted by <a href="/profile/${retweetedby}">@${retweetedby}</a></span>`
}

var replyflag='';
var help="";



if(postdata.replyTo){
        replyflag=`<span> Replying To <a href="/profile/${postdata.replyTo.user.name}">${postdata.replyTo.user.name}</a></span>`
       
}

else{
    help=`<div class="postFotter">
        <div class="postButtonContainer">
            <button data-toggle='modal' data-target="#replyModal">
              <i class='far fa-comment'></i>
            </button>
            

        </div>
        <div class="postButtonContainer green">
            <button class="retweetbutton  ${likeButtonActiveClass}">
              <i class='fas fa-retweet'></i>
              <span>${postdata.retweetUsers.length || ""}</span>
            </button>
            

        </div>
        <div class="postButtonContainer red">
            <button class="likebutton ${likeButtonActiveClass2}">
              <i class='far fa-heart'></i>
              <span>${postdata.likes.length || ""}</span>
            </button>
            

        </div>
    </div>`

}

var button="";
var pinnedText="";
if(postdata.user._id==user){
    var pinClass="";
    var dataTarget="#confirmPinModal";
    if(postdata.pinned==true){
        pinClass="active"
        dataTarget="#unpinModal"
        pinnedText="<i class='fas fa-thumbtack'></i> <span>Pinned Post</span>"
    }
           button =`<button class="pinButton ${pinClass}" data-id="${postdata._id}" data-toggle="modal" data-target="${dataTarget}"><i class="fas fa-thumbtack"></i></button>
            <button data-id="${postdata._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>`
           
}



    return `<div class="post" data-id="${postdata._id}">
                <div class="postActionContainer">
                    ${retweetText}
                </div>
               
                <div class="postActionContainer">
                ${replyflag}
                </div>

                <div class="mainContentContainer">
                 <div class="userImageContainer">
                  <img src="${by.profilePic}">
                  </div>
                  <div class="postContentContainer">
                  <div class="pinnedPostText">${pinnedText}</div>
                    <div class="header">
                    <a class="displayname" href="/users/profile/${by._id}">${by.name}</a>
                    <span class="username">@${by.name}</span>
                    <span class="date">${timestamp}</span>
                    ${button}
                    </div>

                    <div class="postBody">
                        <span>${postdata.content}</span>
                        </div>

                    ${help}

                    

                   
                  </div>
                </div>
                </div>`
}


function showpopup(data){
    var html =createnoty(data);
    var element=$(html);
    element.hide().prependTo(".notificationList").slideDown("fast")
    console.log(html)

    setTimeout(()=>element.fadeOut(400),5000);
}

