var cropper;
$(document).ready(()=>{
    loadposts();
});


    function loadposts(){
    $.get("/api/users/"+user,(results)=>{
        
        output(results, $(".postsContainer"));
    })
}
function output(result,container){
    container.html("");

    if(!Array.isArray(result)){
        result=[result]
    }


    result.forEach(element => {
        var html=createPostHtml(element);
        container.append(html);


    });
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
if(postdata.user._id==user){
    button=`<button data-id="${postdata._id}" data-toggle="modal" data-target="#deletePostModal"><i class="fas fa-times"></i></button>`
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

$(document).on('click',".followButton",(event)=>{
    var button=$(event.target);
    var id=button.data().user;

    $.ajax({
        url:`/api/users/${id}/follow`,
        type: "put",
        success: (data,status,xhr)=>{
          if(xhr.status==404){
              return;
          }
          var diff=1;
          if(data.following && data.following.includes(id)){
              button.addClass("following");
              button.text('following')

          }
          else{
              button.removeClass("following");
              button.text('follow')
              diff=-1;
          }

          var followerslabel=$("#followersValue");

          if(followerslabel.length!=0){
              var val=followerslabel.text();
              val=parseInt(val)
              followerslabel.text(val+diff);
          }


        }
    })
    
})

$('#filephoto').change(function(){

    

    if(this.files && this.files[0]){
        var reader=new FileReader();
        reader.onload=(e)=>{
            var image=document.getElementById("imagePreview")
           $("#imagePreview").attr("src",e.target.result);

           if(cropper!==undefined){
               cropper.destroy();
           }

           cropper= new Cropper(image,{
               aspectRatio: 1 / 1,
               background: false

           });

        }

        reader.readAsDataURL(this.files[0]);
    }
})

$("#imageUploadButton").click(function(){
    var canvas=cropper.getCroppedCanvas();

    if(canvas==null){
        return alert('oye');
    }

    canvas.toBlob((blob)=>{
        var formdata=new FormData();
        formdata.append('croppedImage',blob);

        console.log(formdata);

        $.ajax({
            url: '/api/users/upload',
            type: "post",
            data: formdata,
            processData: false,  //stop to coverting into string
            contentType: false,
            success: (data)=>{
                location.reload();
            }
        })




    })
})

$('#Coverphoto').change(function(){

    

    if(this.files && this.files[0]){
        var reader=new FileReader();
        reader.onload=(e)=>{
            var image=document.getElementById("coverPreview")
           $("#coverPreview").attr("src",e.target.result);

           if(cropper!==undefined){
               cropper.destroy();
           }

           cropper= new Cropper(image,{
               aspectRatio: 16 / 9,
               background: false

           });

        }

        reader.readAsDataURL(this.files[0]);
    }
})

$("#CoverButton").click(function(){
    var canvas=cropper.getCroppedCanvas();

    if(canvas==null){
        return alert('oye');
    }

    canvas.toBlob((blob)=>{
        var formdata=new FormData();
        formdata.append('croppedImage',blob);

        console.log(formdata);

        $.ajax({
            url: '/api/users/upload/cover',
            type: "post",
            data: formdata,
            processData: false,  //stop to coverting into string
            contentType: false,
            success: (data)=>{
                location.reload();
            }
        })




    })
})