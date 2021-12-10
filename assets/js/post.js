$(document).ready(()=>{

    $.get("/api/posts",(results)=>{
       output(results, $(".postsContainer"));
})

});

function output(result,container){
        container.html("");

        result.forEach(element => {
            var html=createPostHtml(element);
            container.append(html);


        });
}