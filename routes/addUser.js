var bracketData = require('../lib/bracketData')
var express = require('express')

var renderLogin = function(req,res,next){
  res.render('addUser')
}

module.exports = function(app){
  var auth = express.basicAuth(function(user, pass) {     
     return (user == "bim" && pass == "thisr1ps");
  },'Log in to add a user')
  app.get('/addUser',auth,renderLogin)
}