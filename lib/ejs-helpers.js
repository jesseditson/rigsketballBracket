var config = require('config-heroku')

var getPaths = function(items,folder){
  var ext = folder == 'javascripts' ? '.js' :
            folder === 'css' ? '.css' :
            ''
  return items.map(function(i){ return '/' + folder + '/' + i + ext })
}

var port

module.exports = function(app) {
  var javascripts, stylesheets
  javascripts = Object.keys(config.client.cdnjavascripts).concat(getPaths(config.client.javascripts,'javascripts'))
  stylesheets = Object.keys(config.client.css).reduce(function(ss,query){
    ss[query] = getPaths(config.client.css[query],'css')
    return ss
  },{})
  
  port = app.set('port')
  
  app.locals({
    stylesheets : stylesheets,
    javascripts : javascripts,
    title : config.title || "My Great Website",
    signupFormId : config.signupFormId
  })
}

var serverStartTime = new Date().getTime()

module.exports.middleware = function(req, res, next){
  res.locals.user = req.user
  res.locals.baseurl = 'http://' + req.host + (config.environment === 'development' ? (':' + port) : '')
  next()
}

