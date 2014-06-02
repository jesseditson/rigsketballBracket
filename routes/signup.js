var bracketData = require('../lib/bracketData')
var save = require('../lib/save')
var url = require('url');

var render = function(req,res,next){
  var bandNum = req.body.bandNum || req.query.bandNum;
  if(!bandNum) return res.redirect('/')
  req.session.signingup = true
  res.render('signup',{bandNum : bandNum})
}

var submit = function(req,res,next){
  // return res.json({body : req.body, query : req.query, referer : req.headers.referer});
  //if(!req.session.signingup || !req.query.bandNum) return res.redirect('/')
  //delete req.session.signingup
  // console.log('signup body',req.body,'query',req.query);
  req.body.operation = 'saveBand'
  var bandNum = req.body.bandNum;
  if (!bandNum) {
    Object.keys(req.body).forEach(function(key){
      if (/clickto\d+/i.test(key)) {
        var parsedURL = url.parse(req.body[key] || '',true);
        if (parsedURL && parsedURL.query && parsedURL.query.bandNum) {
          bandNum = parsedURL.query.bandNum
        }
      }
    });
  }
  req.body.position = bandNum;
  save.call({
    render : function(req,res,err,data){
      res.redirect('/')
    }
  },req,res,next)
}

module.exports = function(app){
  app.all('/signup/submit',submit)
  app.get('/signup',render)
}
