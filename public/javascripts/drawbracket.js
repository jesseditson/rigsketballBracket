(function(){
  var paper = Raphael('background');

  var drawLines = function(side){
    var roundElements = {
      32 : $(side + ' .round32 .bracket'),
      16 : $(side + ' .round16 .bracket'),
      8 : $(side + ' .round8 .bracket'),
      4 : $(side + ' .round4 .bracket')
    };
    Object.keys(roundElements).forEach(function(round){
      if(round == 4) return;
      var leftSide = side == '.leftRounds'
      var next = round / 2
      roundElements[round].each(function(idx,bracket){
        var height = $(bracket).height();
        var width = $(bracket).width();
        var offset32 = $(bracket).position()
        var bracket16 = Math[idx % 2 ? 'floor' : 'ceil'](idx/2);
        var offset16 = $(roundElements[next][bracket16]).position()
        var start = [
          offset32.left + (leftSide ? 0 : width),
          offset32.top + height / 2
        ]
        var end = [
          offset16.left + (leftSide ? width : 0),
          offset16.top + height / 2
        ]
        var path = [
          'M',start[0], start[1],
          'L',start[0] + (leftSide ? -10 : 10), start[1]
        ];
        var leftMiddle = (start[0] - end[0]) / 2
        var topMiddle = start[1] - end[1]
        path.push('L',start[0] - leftMiddle, start[1] - topMiddle)
        path.push('L',end[0], end[1])
        paper.path(path)
      })
    });
  }

  drawLines('.leftRounds')
  drawLines('.rightRounds')
  $(window).resize(function(){
    paper.clear()
    drawLines('.leftRounds')
    drawLines('.rightRounds')
  })
})()
