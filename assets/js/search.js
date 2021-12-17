var timer;

$("#searchBox").keydown((event)=>{
    clearTimeout(timer);
    var textBox=$(event.target);
    var value=textBox.val();
    var searchType=textBox.data().search;

    timer=setTimeout(()=>{
        value=textBox.val().trim();

        if(value==""){
            $(".resultsContainer").html("");
        }
        else{
          search(value,searchType)
        }
    },1000)

    
})

function search(searchTerms,searchType){
    var url1=searchType=="users"? "/api/us/sr" : "/api/ps/sr";

    console.log(url1);
    console.log(searchTerms,searchType)

    
        $.ajax({
            url: url1,
            type: "post",
            data: {obj: searchTerms},
            success: (data)=>{
               if(searchType=="users"){
                  
                    outputUsers(data,$(".resultsContainer"))

               }
               else{
                   outputPosts(data,$(".resultsContainer"))
               }
               
                
            }

        })

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

function outputPosts(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
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
function outputUsers(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createUserHtml(result, true);
        container.append(html);
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
    if (showFollowButton && user!== userData._id) {
        followButton = `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                        </div>`;
    }

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