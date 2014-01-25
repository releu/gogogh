require "serialport"
require "em-websocket"
require "json"

serial = SerialPort.open("/dev/cu.usbmodem1411")

# while data = serial.gets
#   raw = data.chomp
#   p raw
# end

EM.run do
  EM::WebSocket.run(host: "0.0.0.0", port: 1666) do |ws|
    ws.onopen do
      EM.defer do
        filter = Array.new(4, 0)
        
        while data = serial.gets(";")
          raw = data.chomp
          # p raw
          values = raw.split(",").map { |value| value.to_i >= 1000 }
          next if values.size != 4
          
          message = values.each_with_index.map do |active, i|
            if active
              filter[i] = [filter[i] + 1, 20].min
            else
              filter[i] = [filter[i] - 2, 0].max
            end
            
            filter[i] >= 15
          end.to_json
          
          p filter
          
          ws.send message
        end
      end
    end
  end
end
