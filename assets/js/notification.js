$(document).ready(()=>{
    $.get('/notifications/getall',(data)=>{
        console.log(data)
        outputnoty(data,$(".resultsContainer"))
    })
})

function outputnoty(notification,container){
    notification.forEach(element => {
        var html=createnoty(element);
        container.append(html);

        
    });

    if(notification.length==0){
        container.append("<span class='noResults'> nothing to show </span>")
    }
}

$(document).on('click',".notification.active",(e)=>{
    var container=$(e.target);
    var notificationId=container.data().id;

    var href=container.attr("href");

    e.preventDefault();

    var callback=()=>window.location=href;
    markasopened(notificationId,callback);
})

$('#markNotificationAsread').click(()=>markasopened())

function createnoty(notification){
 
    var userFrom=notification.userFrom
    var text=gettext(notification)
    var href=`/users/profile/${userFrom._id}`
    var className=notification.opened ?"": "active";

    return `<a href="${href}" class="resultListItem notification ${className}" data-id="${notification._id}">
            <div class="resultsImageContainer">
                <img src="${userFrom.profilePic}">
               
            </div>
            <div class="resultsDetailsContainer ellipsis">
            <span class="ellipsis">${text}</span>
    </div>
            </a>`
}

function gettext(notification){

    var userFrom=notification.userFrom;


    var userFromName=`${userFrom.name}`

    var text;

    if(notification.notificationType=="retweet"){
        text=`${userFromName} retweeted one of your post`
    }

    else if(notification.notificationType=="post liked"){
        text=`${userFromName} liked one of your post`
    }
    if(notification.notificationType=="post commented"){
        text=`${userFromName} replied to one  of your post`
    }
    if(notification.notificationType=="follow"){
        text=`${userFromName} followed you`
    }

    return `<span class="ellipsis">${text}</span>`
}

function markasopened(notificationId=null,callback=null){
    if(callback==null)callback=()=>location.reload();

    var url=notificationId!=null ? `/notifications/${notificationId}/mark` : `/notifications/mark`;
    
    $.ajax({
        url: url,
        type: "put",
        success: ()=>{
            callback();
        }
    })

}