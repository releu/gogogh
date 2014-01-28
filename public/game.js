$(document).ready(function(){
  var Game = function(player1, player2){
    var self = this
    
    self.state = "promo"
    self.player1 = player1
    self.player2 = player2
    
    self.start = function(){
      self.state = "starting"
      var startNum = 3
      $(".screen").removeClass("active")
      $(".screen").removeClass("n-3")
      $(".screen").removeClass("n-2")
      $(".screen").removeClass("n-1")
      $(".screen").removeClass("n-0")
      $(".screen").removeClass("n--1")
      $(".starting").show()
      
      var handler = function(){
        $(".starting").addClass("active").addClass("n-" + startNum)
        
        startNum = startNum - 1
        if (startNum == -1) {
          clearInterval(i)
          
          $(".starting").addClass("active").addClass("n-" + startNum)
          self.run()
        }
      }
      var i = setInterval(handler, 1000)
      handler()
    }
    
    self.run = function(){
      self.state = "game"
      $(".starting").fadeOut(300)
      $(".race").addClass("active")
    }
    
    self.sendData = function(data){
      if (self.state != "game") {
        return false
      }
      
      self.player1.doStep(data[0], data[1])
      self.player2.doStep(data[2], data[3])
      
      if ((self.player1.position >= 70) || (self.player2.position >= 70)) {
        $(".screen").removeClass("active")
        self.state = "ending"
        
        if (self.player1.position >= 70) {
          $(".ear-win").addClass("active")
        } else {
          $(".gogh-win").addClass("active")
        }
        
        setTimeout(function(){
          self.renew()
        }, 5000)
      }
    }
    
    self.renew = function(){
      self.state = "promo"
      $(".screen").removeClass("active")
      $(".promo").addClass("active")
      self.player1 = new Player("Ear", $(".player-1 .hero"))
      self.player2 = new Player("Van", $(".player-2 .hero"))
    }
  }
  
  var Player = function(name, html){
    var self = this
    
    self.position = 0
    self.lastStep = null
    self.name = name
    self.hero = html
    
    self.hero.css("left", 0)
    
    self.doStep = function(left, right){
      if ((left && right) || (!left && !right)){
        return false
      }
      
      if ((left && self.lastStep != "left") || (right && self.lastStep != "right")){
        self.position = self.position + 0.6
        self.hero.toggleClass("alt")
        self.hero.css("left", "" + self.position + "%")
      }
      
      if (left) {
        self.lastStep = "left"
      } else {
        self.lastStep = "right"
      }
    }
  }
  
  var game = new Game()
  game.renew()

  $(window).on("keypress", function(e){
    if (e.which == 32) {
      game.start()
    }
    if (e.which == 113 || e.which == 1081) {
      game.sendData([true, false, false, false])
    }
    if (e.which == 119 || e.which == 1094) {
      game.sendData([false, true, false, false])
    }
    if (e.which == 111 || e.which == 1097) {
      game.sendData([false, false, true, false])
    }
    if (e.which == 112 || e.which == 1079) {
      game.sendData([false, false, false, true])
    }
  })
  
  var ws = new WebSocket('ws://0.0.0.0:1666')
  ws.onmessage = function(e) {
    var data = JSON.parse(e.data)
    game.sendData(data)
    
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
})
