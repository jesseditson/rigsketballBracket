var db = require('../lib/mongoWrapper').db.add('bands').add('rounds')
var async = require('async')

var save = module.exports = function(req,res,next){
  var render = this.render
  var data = req.body || req.query;
  if(data.operation == 'saveBand'){
    db.bands.findOne({position : data.position},function(err,pBand){
      if(err) return render(req,res,err)
      if(pBand && !req.user) return render(req,res,new Error("You're not allowed to do that."))
      if(pBand){
        // editing. only name is editable
        db.bands.update({position : data.position},{$set : {name : data.bandname}},function(err){
          render(req,res,err,{})
        })
      } else {
        // this is available to anyone.
        var band = {
          name : data.bandname,
          position : data.position,
          created_at : new Date(),
          scores : {
            32 : false,
            16 : false,
            8 : false,
            4 : false,
            2 : false
          },
          info : data
        }
        db.bands.insert(band,function(err){
          render(req,res,err,{})
        })
      }
    })
  } else if(!req.user){
    // authenticated save commands
    render(req,res,new Error("You're not allowed to do that."))
  } else if(req.query.operation == 'editScore') {
    var up = {}
    up['scores.' + req.query.round] = req.query.score
    db.bands.update({position : req.query.position},{$set : up},function(err){
      render(req,res,err,{})
    })
  } else if(req.query.operation == 'setInfo'){
    var up = {}
    if(req.query.location) up.location = req.query.location
    if(req.query.date) up.date = req.query.date
    db.rounds.update({round : parseInt(req.query.round,10), position : parseInt(req.query.position,10)},{$set : up},function(err,updated){
      render(req,res,err,{})
    })
  }
}
