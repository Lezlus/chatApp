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
      // this.callbacks["notifyUserIsActive"]()
    }
    this.socketRef.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.option === "userActive") {
        this.setActiveUser(e.data);
      } else {
        this.socketNewMessage(e.data);
      }
      console.log("chat socket recieved data")
    }
    this.socketRef.onclose = () => {
      console.error("chat socket closed");
    }

  }

  sendUserIsActive(userData) {
    try {
      this.socketRef.send(JSON.stringify({
        'username': userData.username,
        'user_Id': userData.userId,
        'option': "active_notification"
      }));
    } catch (error) {
      console.log(error.message)
    }
  }

  sendMessage(msgData) {
    try {
      this.socketRef.send(JSON.stringify({
        'message': msgData.message,
        'username': msgData.username,
        'user_Id': msgData.userId,
        'option': "sendMessage"
      }));
    } catch (error) {
      console.log(error.message)
    }
  }

  newChatMessage(msgData) {
    this.sendMessage(msgData);
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    this.callbacks["newMessage"](parsedData)
  }

  setActiveUser(data) {
    const parsedData = JSON.parse(data);
    this.callbacks["activeUser"](parsedData)
  }

  addCallbacks(newMessageCallback) {
    this.callbacks["newMessage"] = newMessageCallback;
  }

  addUserActive(callback) {
    this.callbacks["activeUser"] = callback;
  }

  notifyUserOnline(callback) {
    this.callbacks["notifyUserIsActive"] = callback;
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