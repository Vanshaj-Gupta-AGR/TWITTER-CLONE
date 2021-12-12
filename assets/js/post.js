$(document).ready(()=>{

    $.get("/api/posts",(results)=>{
       output(results, $(".postsContainer"));
})

});

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