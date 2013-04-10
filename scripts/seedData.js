for(var r=32;r>1;r=r/2){
  for(var p=1;p<=r/2;p++){
    var b = {
      date : false,
      location : false,
      round : r,
      position : p
    }
    db.rounds.insert(b)
  }
}