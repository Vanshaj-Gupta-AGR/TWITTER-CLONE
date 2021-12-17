
module.exports.searchpage=async function(req,res){
        return res.render('search',{
            title: "search",
            layout: "layout3",
            selectedTab: "posts"
        })
    }

    module.exports.tabs=async function(req,res){
        return res.render('search',{
            title: "search",
            layout: "layout3",
            selectedTab: req.params.selected
        })
    }    

