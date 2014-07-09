$(function(){
  var brackets = $('#mobile-brackets');
  if(!brackets.length){
    return;
  }

  // local variables
  // var win = $(window);
  // var windowWidth = win.width();
  // var autoscrolling = false;
  // var currentPage;

  // functions
  // var updatePage = function(pageNum,completion){
  //   currentPage = pageNum;
  //   var pages = $('.round-page');
  //   var currentRound = $(pages.get(pageNum));
  //   pages.removeAttr('style');
  //   pages.animate({height:currentRound.height()},200);
  // }

  // var scrollToPosition = function(targetLeft, movement, done){
  //   autoscrolling = true;
  //   var nextPage = targetLeft / windowWidth;
  //   var nextAnimation = null;
  //   if(currentPage != nextPage){
  //     nextAnimation = {scrollTop: 0};
  //   }
  //   updatePage(nextPage);
  //   $('body,html').animate({scrollLeft: movement},200,function(){
  //     autoscrolling = false;
  //     if(nextAnimation){
  //       $('body,html').animate(nextAnimation,100,done);
  //     }
  //   });
  // }
  var updateNav = function(){
    $('.top-bg,.round-page > h2').css({top : $(window).scrollTop()});
  }

  // initialization
  // updatePage(win.scrollLeft() / windowWidth);
  updateNav();

  // scrolling
  $('#content').css({
    width : $(window).width(),
    height : $(window).height()
  });

  var scroller = new IScroll('#content', {
    mouseWheel: true,
    scrollbars: false,
    snap:true,
    scrollX:true,
    scrollY:true,
    eventPassthrough : true
  });

  // page left/right
  brackets.on('click','.arrow',function(e){
    if($(e.currentTarget).is('.left')){
      scroller.prev();
    } else {
      scroller.next();
    }
  });

  $(window).scroll(function(){
    updateNav();
  })

  // scroll snapping
  // var currentTimeout;
  // var triggerTime = 100;
  // win.scroll(function(){
  //   updateNav();
  //   if(currentTimeout) clearTimeout(currentTimeout);
  //   if(autoscrolling) return;
  //   currentTimeout = setTimeout(function(){
  //     var left = win.scrollLeft();
  //     var distance = left % windowWidth;
  //     if(distance != 0){
  //       // we're not on a page, get us there
  //       var movement;
  //       var targetLeft = left;
  //       if(distance < windowWidth / 2){
  //         // go left
  //         movement = '-=' + distance;
  //         targetLeft -= distance;
  //       } else {
  //         // go right
  //         var num = (windowWidth - distance);
  //         movement = "+=" + num;
  //         targetLeft += num;
  //       }
  //       scrollToPosition(targetLeft,movement);
  //     }
  //   },triggerTime);
  // })
})
