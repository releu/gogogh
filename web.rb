require "sinatra"
require "newrelic_rpm"
require "slim"

class GoGogh < Sinatra::Base
  get "/" do
    slim :game
  end

  get "/game.js" do
    render "game.js"
  end

  get "/game.css" do
    less :game
  end
end
