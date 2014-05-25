var save = require('../lib/save')
var bracketData = require('../lib/bracketData')

var render = function(req,res,err,data){
  data = data || {}
  bracketData(function(err,info){
    if(err) return res.json({error : err.message})
    res.render('brackets',info,function(err,html){
      if(err) throw err
      data.html = html
      res.send(req.query.callback + '('+JSON.stringify(data)+');')
    })
  })
}

module.exports = function(app){
  app.get('/save',function(req,res,next){
    if (!req.body || !req.body.bandNum) {
      req.body = req.query;
    }
    save.call({render : render},req,res,next);
  })
}
