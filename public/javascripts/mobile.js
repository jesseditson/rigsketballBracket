$(function(){
  if(!$('#mobile-brackets').length){
    return;
  }
  var win = $(window);
  var windowWidth = win.width();
  var currentTimeout;
  var triggerTime = 100;
  var autoscrolling = false;
  var currentPage = win.scrollLeft() / windowWidth;
  win.scroll(function(){
    if(currentTimeout) clearTimeout(currentTimeout);
    if(autoscrolling) return;
    currentTimeout = setTimeout(function(){
      var left = win.scrollLeft();
      var distance = left % windowWidth;
      if(distance != 0){
        // we're not on a page, get us there
        var movement;
        var targetLeft = left;
        if(distance < windowWidth / 2){
          // go left
          movement = '-=' + distance;
          targetLeft -= distance;
        } else {
          // go right
          var num = (windowWidth - distance);
          movement = "+=" + num;
          targetLeft += num;
        }
        autoscrolling = true;
        var nextPage = targetLeft / windowWidth;
        var nextAnimation = null;
        if(currentPage != nextPage){
          nextAnimation = {scrollTop: 0};
        }
        currentPage = nextPage;
        $('body,html').animate({scrollLeft: movement},200,function(){
          autoscrolling = false;
          if(nextAnimation){
            $('body,html').animate(nextAnimation,100);
          }
        });
      }
    },triggerTime);
  })
})
