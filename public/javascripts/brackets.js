$(function(){
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
  console.log(query)
  
  var saveclicked = function(){
    var signingup = $(this).hasClass('confirm')
    if(signingup){
      var ok = confirm("Are you sure you want to select this spot? You can't change it after you've selected it.")
      if(!ok){
        $(this).closest('.contender').find('input').val('')
        return false
      }
    }
    var inp = $(this).closest('.contender').find('input')
    save(inp,{
      operation : 'saveBand',
      name : inp.val(),
      position : inp.attr('name')
    },function(){
      if(signingup) window.location = '/'
    })
  }
  
  $("#brackets")
    .on('focus','.bandName input',function(){
      var savebutton = $(this).closest('.contender').find('.savebutton')
      if(query.bandname) $(this).val(query.bandname)
      savebutton.on('click',saveclicked)
      showButton(savebutton)
    })
    .on('blur','.bandName input',function(){
      var savebutton = $(this).closest('.contender').find('.savebutton')
      setTimeout(function(){
        savebutton.off('click')
        hideButton(savebutton)
      },200)
    })

  $(".loggedin #brackets")
    .on('click','.score',function(){
      if($(this).find('input').length) return
      $(this).html('<input type="tel" placeholder="##" value="'+$(this).html()+'" name="score" class="scorenum"/><input type="button" class="savescore" value="save"/>')
    })
    .on('click','.score .savescore',function(){
      var c = $(this).closest('.contender')
      var num = c.find('.score').attr('data-position')
      var round = c.find('.score').attr('data-round')
      var score = c.find('.scorenum').val()
      c.find('.score').html(score)
      save($(this),{
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
    var save = function(inp,data,callback){
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