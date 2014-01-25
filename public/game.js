$(document).ready(function(){
  var ws = new WebSocket('ws://0.0.0.0:1666')
  ws.onmessage = function(e) {
    var data = JSON.parse(e.data)
    $.each(data, function(i, active) {
      var sens = $(".sens" + (i + 1))
      if (active) {
        sens.addClass("active")
      } else {
        sens.removeClass("active")
      }
    })
  }
  ws.onerror = function(e) {
    console.log(e)
  }

  var Game = function(){
    this.start = function(){
      var startNum = 3
      $(".screen").removeClass("active")
      $(".starting").addClass("active")
      var i = setInterval(function(){
        $(".starting").text(startNum)
        startNum = startNum - 1
        if (startNum == 0) {
          clearInterval(i)
        }
      }, 1000)
    }
  }

  var game = new Game()

  $(window).one("keypress", function(e){
    if (e.which == 32) {
      game.start()
    }
  })
})
