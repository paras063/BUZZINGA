exports.get404=(req,res)=>{
res.render('404',{pageTitle:'404'})
}

exports.get500=(err,req,res,next)=>{
    console.log(err)
res.render('500',{pageTitle:'500'})
}