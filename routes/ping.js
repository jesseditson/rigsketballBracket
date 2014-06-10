module.exports = function(app){
  app.all('/ping',function(req,res,next){
    res.render("ping",{})
  });
}
