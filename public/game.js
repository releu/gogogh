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
      self.state = "game"
      $(".screen").removeClass("active")
      $(".race").addClass("active")
    }
    
    self.sendData = function(data){
      if (self.state != "game") {
        return false
      }
      
      self.player1.doStep(data[0], data[1])
      self.player2.doStep(data[2], data[3])
      
      if (self.player1.position >= 80) {
        self.renew()
        self.start()
      } else if (self.player2.position >= 80) {
        self.renew()
        self.start()
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
        self.position = self.position + 1
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
