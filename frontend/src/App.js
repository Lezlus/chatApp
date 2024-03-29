import './App.css';
import {Routes, Route, useNavigate, useParams, Link, useLocation} from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import WebSocketInstance from './services/WebSocket';
import './main.css';
import UserContext from './context/context';
import Login from './login';
import { v4 as uuidv4 } from 'uuid';
import authService from './services/authService';
import Register from './register';


const getMessageList = (id, messageLists) => {
  for (const messageList of messageLists) {
    if (messageList.to_user.id === parseInt(id)) {
      return messageList;
    }
  }
  return null;
}

const getReceivingUserMessageList = (id, messageLists) => {
  for (const messageList of messageLists) {
    if (messageList.to_user === parseInt(id)) {
      return messageList.id;
    }
  }
  return null;
}

const App = () => {
  return (
    <div className="main-warpper">
      <div className="home-page-desktop row">
        <div className="room-list col-4">
          <RoomList />
        </div>
        <div className="col-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:roomName" element={<Room />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Register />} />
          </Routes>
        </div>
      </div>
      <div className="home-page-mobile d-md-none">
        <div className="overlay" id="myNav">
          <div className="overlay-content row">
            <div className="col-12 overlay-links">
              <Link to="/"><h4>Home</h4></Link>
            </div>
            <RoomList />
          </div>
        </div>
        <div className="overlay-right" id="sidebar-right"></div>
        <div className="home-page-routes-container">
          <div className="hamburger-btn-wrapper d-xl-none" id="hamburger-btn-wrap">
            <div className="hamburger-btn"></div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:roomName" element={<Room />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

const Home = () => {
  const myContext = useContext(UserContext)
  // const [username, setUsername] = useState(myContext.user)
  useEffect(() => {
    console.log("home page")
    if (WebSocketInstance.isSocketOpen()) {
      WebSocketInstance.closeWebSocket();
    }
    
  }, [])

  const displayLogin = () => {
    if (!myContext.loggedIn) {
      return (
        <div className="login-register-wrapper">
          <Link to={'/login/'}><h2>Login</h2></Link>
          <Link to={'/register/'}><h2>Register</h2></Link>
        </div>
      )
    } else {
      return <Link to={'/login/'}><h2>Login</h2></Link>
    }
  }

  const displayUsername = () => {
    if (!(Object.keys(myContext.user).length === 0)) {
      console.log("trying to display username")
      return (
        <h2>{myContext.user.username}</h2>
      )
    }
  }

  return (
    <div className="room-wrapper">
      <div className="current-room-txt-wrapper">
        <h2 className="current-room-txt">Home</h2>
        {displayUsername()}
        {displayLogin()}
      </div>
      <div className="chatbox">
        <div className="column-1">
          
        </div>
      </div>
    </div>

  )
}



const Room = (props) => {
  let params = useParams();
  const location = useLocation();
  const { directMessageData } = location.state;
  const smallerId = directMessageData.currentUserId < directMessageData.receivingUserId ? directMessageData.currentUserId : directMessageData.receivingUserId;
  const largerId = directMessageData.currentUserId > directMessageData.receivingUserId ? directMessageData.currentUserId : directMessageData.receivingUserId;
  const myContext = useContext(UserContext)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receivingUsername, setReceivingUsername] = useState("")
  const [messageList, setMessageList] = useState({});
  const [receivingMessageListId, setReceivingMessageListId] = useState("");
  WebSocketInstance.addCallbacks((msgData) => {
    console.log(msgData.message);
    console.log(msgData.username);
    setMessages([...messages, {id: uuidv4(), owner_str: msgData.username, username: msgData.username, body: msgData.message}]);
  });

  // WebSocketInstance.notifyUserOnline(() => {
  //   WebSocketInstance.sendUserIsActive({username: myContext.user.username, userId: myContext.user.id})
  // })

  WebSocketInstance.addUserActive((userData) => {
    let newMessageHistory = {...myContext.messageHistory}
    let newMessageLists = [...newMessageHistory.message_lists]
    console.log(userData.username)
    for (const messageList of newMessageLists) {
      if (userData.userId === messageList.to_user.id) {
        messageList.to_user.is_online = true;
      }
    }

    newMessageHistory.message_lists = newMessageLists;
    myContext.setMessageHistory(newMessageHistory);

  })

  useEffect(() => {
    let messageList = directMessageData.messageList;
    console.log(messageList);
    setMessages(messageList.messages);
    authService.getMessageHistoryMinifiedData(messageList.to_user.message_history)
      .then(data => {
        console.log(data)
        let recievingUserMessageList = getReceivingUserMessageList(myContext.user.id, data.message_lists);
        setReceivingMessageListId(recievingUserMessageList)
        setMessageList(messageList);
        setReceivingUsername(messageList.to_user.username)
      })
    // If websocket is open then that means I came from a different route
    // Close then reconnect with new path
    if (WebSocketInstance.isSocketOpen()) {
      WebSocketInstance.closeWebSocket()
    }
    WebSocketInstance.connect(`${smallerId}-to-${largerId}`);

  }, [params.roomName])

  const submitChatMessage = () => {
    const messageInput = message;
    WebSocketInstance.newChatMessage({message: messageInput, username: myContext.user.username, userId: myContext.user.id})
    // Add the message to the DB here since if you make it happen after the websocket get's a message all current clients
    // will try to add the same message to the DB
    addMessageToBackend(messageInput)
  }

  const addMessageToBackend = (msg) => {
    // Add it to the db in django
    const newMessage = {body: msg, 
                        owner_str: myContext.user.username,
                        message_list: [messageList.id, receivingMessageListId],
                        owner: myContext.user.id}
    authService.createMessage(newMessage);
  }

  const listMessages = () => {
    return messages.map(msg => {
      return <ChatBubble key={msg.id} author={msg.owner_str} username={msg.owner_str} message={msg.body} /> 
    })
  }

  return (
    <div className="room-wrapper">
      <div className="current-room-txt-wrapper">
        <h2 className="current-room-txt">{receivingUsername}</h2>
      </div>
      <div className="chatbox">
        <div className="column-1">
          {listMessages()}
        </div>
      </div>
      <div className="input-chat-wrapper">
        <input type="text" onChange={(event) => setMessage(event.target.value)} placeholder="Type your text" />
        <button className="btn" onClick={() => submitChatMessage()}>Send</button>
      </div>
    </div>
  )
}

const ChatBubble = (props) => {
  const myContext = useContext(UserContext)
  const displayChatBubble = () => {
    if (myContext.user.username === props.author) {
      return (
        <div className="msg-row">
          <div className="msg-text author-chat-bubble">
            <h2>{props.username}</h2>
            <p>{props.message}</p>
          </div>
        </div>
      )
    }
    return (
      <div className="msg-row msg-row-2">
        <div className="msg-text chat-bubble">
          <h2>{props.username}</h2>
          <p>{props.message}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {displayChatBubble()}
    </>
  )
}

const RoomList = () => {
  const myContext = useContext(UserContext)

  const displayRooms = () => {
    if (!(Object.keys(myContext.messageHistory).length === 0)) {
      return myContext.messageHistory.message_lists.map(messageRoom => {
        return (
          <div key={messageRoom.id} className="col-12 overlay-links">
            <Link key={messageRoom.id} to={`/chat/${myContext.user.id}-to-${messageRoom.to_user.id}`} 
              state={{directMessageData: {currentUserId: myContext.user.id, receivingUserId: messageRoom.to_user.id, messageList: messageRoom}}}>
              <RoomItem messageRoomName={messageRoom.to_user.username} key={messageRoom.id} isOnline={messageRoom.to_user.is_online} />
            </Link>
          </div>
        )
      })
    }
  }

  return (
    <div className="row">
      {displayRooms()}
    </div>
  )
}

const RoomItem = (props) => {

  const activeStatus = () => {
    if (props.isOnline) {
      return <i className="fas fa-circle user-active"></i>
    } else {
      return <i className="fas fa-circle user-inactive"></i>
    }
  }

  return (
    <div className="room-bar">
      <div className="room-bar-img-wrapper">
        <h4>Img Placeholder</h4>
      </div>
      <div className="room-bar-title-wrapper">
        <h5>{props.messageRoomName}{activeStatus()}</h5>
      </div>
    </div>
  )
}

export default App
