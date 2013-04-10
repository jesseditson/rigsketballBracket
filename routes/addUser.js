var bracketData = require('../lib/bracketData')
var express = require('express')
var config = require('config-heroku')

var renderLogin = function(req,res,next){
  res.render('addUser')
}

module.exports = function(app){
  var auth = express.basicAuth(function(user, pass) {     
     return (user == config.rootuser && pass == config.rootpass);
  },'Log in to add a user')
  app.get('/addUser',auth,renderLogin)
}