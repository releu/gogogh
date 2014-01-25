require "sinatra"
require "slim"

get "/" do
  slim :game
end

get "/game.js" do
  render "game.js"
end

get "/game.css" do
  less :game
end
