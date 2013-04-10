var bracketData = require('../lib/bracketData')

var renderBrackets = function(req,res,next){
  bracketData(!!req.user,function(err,info){
    if(err) return res.json({error : err.message})
    res.render("brackets",info)
  })
}

module.exports = function(app){
  app.all('/',renderBrackets)
}