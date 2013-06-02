var bracketData = require('../lib/bracketData')
var save = require('../lib/save')

var render = function(req,res,next){
  if(!req.query.bandNum) return res.redirect('/')
  req.session.signingup = true
  res.render('signup',{bandNum : req.query.bandNum})
}

var submit = function(req,res,next){
  //if(!req.session.signingup || !req.query.bandNum) return res.redirect('/')
  //delete req.session.signingup
  req.query.operation = 'saveBand'
  save.call({
    render : function(req,res,err,data){
      res.redirect('/')
    }
  },req,res,next)
}

module.exports = function(app){
  app.get('/signup/submit',submit)
  app.get('/signup',render)
}