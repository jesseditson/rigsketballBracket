var bracketData = require('../lib/bracketData')

var renderLogin = function(req,res,next){
  res.render('login')
}

module.exports = function(app){
  app.get('/login',renderLogin)
}