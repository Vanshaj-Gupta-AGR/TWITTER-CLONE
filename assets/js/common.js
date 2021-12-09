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

    })

})