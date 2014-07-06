var db = require('../lib/mongoWrapper').db.add('bands').add('rounds')
var async = require('async')

var renderBrackets = module.exports = function(insertAllowed,callback){
  if(typeof insertAllowed == 'function'){
    callback = insertAllowed
    insertAllowed = true
  }
  async.parallel({
    bands : db.bands.findArray.bind(db.bands,{}),
    rounds : db.rounds.findArray.bind(db.rounds,{})
  },function(err,info){
    if(err) return callback(err)
    var rounds = info.rounds.reduce(function(o,r){
      o[r.round] = o[r.round] || {}
      o[r.round][r.position] = r
      return o
    },{})
    var bands = info.bands.reduce(function(o,b){
      o[b.position] = b
      return o
    },{})
    var full = bands.length >= 32
    var brackets = generateBrackets(bands,rounds)
    var rightBrackets = {}
    var leftBrackets = {}
    var winnerBracket
    var winner
    Object.keys(brackets).forEach(function(rNum){
      var round = brackets[rNum]
      if(rNum == 'winner'){
        winner = round
      } else if(Object.keys(round).length == 1){
        winnerBracket = round
        if(typeof round.winner === 'number'){
          winner = round.bands[round.winner]
        }
      } else {
        Object.keys(round).forEach(function(pNum){
          if(parseInt(pNum) <= parseInt(rNum)/2/2){
            leftBrackets[rNum] = leftBrackets[rNum] || {}
            leftBrackets[rNum][pNum] = round[pNum]
          } else {
            rightBrackets[rNum] = rightBrackets[rNum] || {}
            rightBrackets[rNum][pNum] = round[pNum]
          }
        })
      }
    })
    callback(null,{full : full, brackets: brackets, leftBrackets : leftBrackets, rightBrackets : rightBrackets, winnerBracket : winnerBracket, winningBand : winner, insertAllowed : insertAllowed})
  })
}

var addWinner = function(brackets,bNum,position){
  var bracket = brackets[bNum][position]
  position = parseInt(position)
  if(typeof bracket.winner === 'number'){
    // this bracket has a winner. Move them to the next one.
    var nextPosition = position % 2 ? (position+1)/2 : position/2
    var winningBand = bracket.bands[bracket.winner]
    if(!brackets[bNum/2][nextPosition].bands){
      brackets[bNum/2][nextPosition].bands = [winningBand]
    } else if(brackets[bNum/2][nextPosition].bands[0]){
      brackets[bNum/2][nextPosition].bands[1] = winningBand
    } else {
      brackets[bNum/2][nextPosition].bands[0] = winningBand
    }
  } else if(typeof bracket.winner === 'undefined'){
    // no winner for this bracket yet.
  } else if(bracket.winner === false){
    // this bracket was a tie. (not doing anything with this for now.)
  }
  return brackets
}

var defaultBracket = {
  bands : []
}

var generateBrackets = function(bands,rounds,scores){
  Object.keys(rounds).reverse().forEach(function(rNum,rIndex){
    var round = rounds[rNum]
    Object.keys(round).forEach(function(pNum){
      var bracket = rounds[rNum][pNum]
      var band1
      var band2
      if(rNum == 32){
        band1 = bands[bracket.position] || false
        band2 = bands[(bracket.round/2) + bracket.position] || false
        rounds[rNum][pNum].bands = [
          band1,
          band2
        ]
      } else {
        rounds[rNum][pNum].bands = rounds[rNum][pNum].bands || []
        band1 = rounds[rNum][pNum].bands[0]
        band2 = rounds[rNum][pNum].bands[1]
      }
      if(band1 && band2){
        console.log(band1,band2)
        var scores = [parseInt(band1.scores[rNum],10),parseInt(band2.scores[rNum],10)]
        var winner = scores[0] > scores[1] ?
                    0 :
                    scores[1] > scores[0] ?
                    1 :
                    false
        rounds[rNum][pNum].winner = winner
        if(rNum == 2){
          rounds['winner'] = rounds[rNum][pNum].bands[winner]
        } else {
          rounds = addWinner(rounds,rNum,pNum)
        }
      }
    })
  })
  return rounds
}
