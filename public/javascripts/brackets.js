$(function(){
  // init - make sure band names are correctly sized
  function adjustFont(){
    var t = this
    if(!!(t.scrollHeight - $(t).height())){
      var fontSize = parseInt($(t).css('font-size'),10)
      $(t).css('font-size',(--fontSize) + 'px')
      if(fontSize > 6) adjustFont.call(t)
    }
  }
  $('.bandName').each(adjustFont)

  var qp = window.location.search.replace(/^\?/,'').split('=')
  var query = {}
  var key
  for(var i=0;i<qp.length;i++){
    if(i % 2){
      query[key] = decodeURIComponent(qp[i])
    } else {
      key = decodeURIComponent(qp[i])
    }
  }

  var saveclicked = function(){
    var signingup = true;//$(this).hasClass('confirm')
    if(signingup){
      var ok = confirm("Are you sure you want to select this spot? You can't change it after you've selected it.")
      if(!ok){
        $(this).closest('.contender').find('input').val('')
        return false
      }
    }
    var inp = $(this).closest('.contender').find('input')
    save({
      operation : 'saveBand',
      bandname : inp.val(),
      position : inp.attr('name')
    },function(){
      if(signingup) window.location = '/'
    })
  }

  var datavalue = function(el,attr){
    var v = decodeURIComponent(el.attr('data-'+attr))
    if(v == 'false') v = ''
    return v
  }
  var getOnScreenPos = function(p,s,l,t){
    var pos = {
      left : p.left - l,
      top : p.top - t
    }
    if(pos.left < 0){
      pos.left = p.left + s
    }
    return pos
  }
  var overlayOn = false
  var currentBracket
  $("body")
    .on('click','.saveinfo',function(){
      save({
        operation : 'setInfo',
        round : currentBracket.attr('data-round'),
        position : currentBracket.attr('data-position'),
        location : $(this).closest('#infoOverlay').find('.location').val(),
        date : $(this).closest('#infoOverlay').find('.date').val()
      },function(){
        window.location.href = window.location.href
      })
    })

  var showInfo = function(toggle){
    var o = $("#infoOverlay")
    if(overlayOn) return
    if(toggle === true) overlayOn = true
    var b = $(this)
    currentBracket = b
    o.css(getOnScreenPos(b.offset(),80,350,30))
    var b1 = b.find('.first.contender .bandName')
    var b2 = b.find('.second.contender .bandName')
    if(b1.find('input').length){ b1 = "???" } else { b1 = b1.html() }
    if(b2.find('input').length){ b2 = "???"} else { b2 = b2.html() }
    o.find('.band1').html(b1)
    o.find('.band2').html(b2)
    var d = o.find('.date')
    var l = o.find('.location')
    if(d.is('input')){
      d.val(datavalue(b,'date'))
    } else {
      d.html(datavalue(b,'date'))
    }
    l.html(datavalue(b,'location'))
    o.fadeIn(200)
  }
  var hideInfo = function(toggle){
    if(overlayOn && toggle !== true) return
    overlayOn = false
    $(this).closest('.overlay').fadeOut(200)
  }

  $("#brackets")
    .on('focus','.bandName input',function(){
      var savebutton = $(this).closest('.contender').find('.savebutton').first()
      if(query.bandname) $(this).val(query.bandname)
      savebutton.on('click',saveclicked)
      showButton(savebutton)
    })
    .on('blur','.bandName input',function(e){
      if ($(e.currentTarget).is('input')) {
        saveclicked.call(this,e);
      }
      var savebutton = $(this).closest('.contender').find('.savebutton').first()
      savebutton.off('click')
      hideButton(savebutton)
    })
    .on('click','.bracket',function(){
      showInfo.call(this,true)
    })
    .on('mouseenter','.bracket',showInfo)
    .on('mouseleave','.bracket',hideInfo)
    .on('click','.signup_link',function(el){
      var num = $(el.currentTarget).attr('data-num')
      var link = '//' + window.location.host + '/signup?bandNum=' + num
      window.location = link
    })

  $('body')
    .on('click','.close',function(){
      hideInfo.call(this,true)
    })
    .on('mouseleave','.overlay',hideInfo)

  $(".loggedin #brackets")
    .on('click','.score',function(){
      if($(this).find('input').length) return
      var initialVal = parseInt($(this).html(),10)
      $(this).html('<input type="tel" placeholder="##" value="'+initialVal+'" name="score" class="scorenum"/><input type="button" class="savescore" value="save"/>')
    })
    .on('click','.score .savescore',function(){
      var c = $(this).closest('.contender')
      var num = c.find('.score').attr('data-position')
      var round = c.find('.score').attr('data-round')
      var score = c.find('.scorenum').val()
      c.find('.score').html(score)
      save({
        operation : 'editScore',
        score : score,
        position : num,
        round : round
      })
    })

    var showButton = function(button){
      button.show().css({opacity : 0,left:0}).animate({left:90,opacity:1},200)
    }
    var hideButton = function(button){
      button.animate({left:0,opacity:0},200,function(){
        button.removeAttr('style')
      })
    }
    var save = function(data,callback){
      $.ajax({
        dataType: "jsonp",
        url: "/save",
        data: data,
        success: function(r){
          if(r.error) alert("Error Saving : "+r)
          $("#brackets").html($(r.html).find('#brackets').html())
          if(callback) callback()
        }
      });
    }
})
