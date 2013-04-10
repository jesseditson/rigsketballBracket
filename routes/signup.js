var bracketData = require('../lib/bracketData')

var render = function(req,res,next){
  req.session.signingup = true
  res.render('signup')
}

var submit = function(req,res,next){
  if(!req.session.signingup) res.redirect('/signup')
  delete req.session.signingup
  bracketData(true,function(err,info){
    if(err) return res.json({error : err.message})
    res.render("brackets",info)
  })
}

module.exports = function(app){
  app.get('/signup/submit',submit)
  app.get('/signup',render)
}