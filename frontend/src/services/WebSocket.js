class WebSocketService {
  static instance = null;
  callbacks = {};


  static getInstace() {
    if (!WebSocketService.instace) {
      WebSocketService.instace = new WebSocketService();
    }
    return WebSocketService.instace;
  }

  constructor() {
    this.socketRef = null;
  }
  
  connect(roomName) {
    const path = `ws://localhost:8000/ws/chat/${roomName}/`;
    this.socketRef = new WebSocket(path);

    this.socketRef.onopen = () => {
      console.log("socket is open")
      // this.sendMessage("Python and React are connected")
    }
    this.socketRef.onmessage = (e) => {
      console.log("chat socket recieved data")
      this.socketNewMessage(e.data);
    }
    this.socketRef.onclose = () => {
      console.error("chat socket closed");
    }

  }

  sendMessage(msg) {
    try {
      this.socketRef.send(JSON.stringify({
        'message': msg
      }));
    } catch (error) {
      console.log(error.message)
    }
  }

  newChatMessage(msg) {
    this.sendMessage(msg);
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    this.callbacks["newMessage"](parsedData.message)
  }

  addCallbacks(newMessageCallback) {
    this.callbacks["newMessage"] = newMessageCallback;
  }

  isSocketOpen() {
    const socket = this.socketRef;
    if (socket) {
      if (socket.readyState === 1) {
        console.log("Connection is open, attempting to close")
        // Since React Router behaves like an SPA we need to manually close connection
        return true;
        
      }
      return false;
      
    } 
    console.log("Socket is null")
    return false
  }

  closeWebSocket() {
    this.socketRef.close();
  }
}

const WebSocketInstance = WebSocketService.getInstace();

export default WebSocketInstance;