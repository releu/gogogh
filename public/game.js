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

  var Game = function(player1, player2){
    var self = this
    
    self.player1 = player1
    self.player2 = player2
    
    self.start = function(){
      var startNum = 3
      $(".screen").removeClass("active")
      
      var i = setInterval(function(){
        $(".starting").addClass("active")
        $(".starting").text(startNum)
        startNum = startNum - 1
        if (startNum == -1) {
          clearInterval(i)
          self.run()
        }
      }, 200)
    }
    
    self.run = function(){
      $(".screen").removeClass("active")
      $(".race").addClass("active")
      
      var i1 = setInterval(function(){
        if (self.player1.doStep()){
          clearInterval(i1)
          clearInterval(i2)
        }
      }, Math.floor((Math.random()*100)+100))
      var i2 = setInterval(function(){
        if (self.player2.doStep()){
          clearInterval(i1)
          clearInterval(i2)
        }
      }, Math.floor((Math.random()*200)+100))
    }
  }
  
  var Player = function(name, html){
    var self = this
    self.position = 0
    self.name = name
    self.hero = html
    
    self.doStep = function(){
      self.position = self.position + 1
      self.hero.toggleClass("alt")
      self.hero.css("left", "" + self.position + "%")
      if (self.position >= 80) {
        alert(name + " win!")
        document.location = document.location
        return true
      } else {
        return false
      }
    }
  }
  
  var player1 = new Player("Ear", $(".player-1 .hero"))
  var player2 = new Player("Van", $(".player-2 .hero"))
  var game = new Game(player1, player2)

  $(window).one("keypress", function(e){
    if (e.which == 32) {
      game.start()
    }
  })
})
