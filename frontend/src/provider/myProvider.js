import authService from "../services/authService";
import {UserProvider} from '../context/context';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const MyProvider = (props) => {
  const [currentUser, setCurrentUser] = useState({});
  const [messageHistory, setMessageHistory] = useState({});
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') ? true : false);
  let navigate = useNavigate();
  useEffect(() => {
    getContextData();
  }, [])

  const getContextData = async () => {
    if (loggedIn) {
      console.log("detected token")
      const userData = await authService.getAuthUserWithToken();
      if (userData instanceof Error) {
        setLoggedIn(false);
        navigate('/login/');
      } else {
        const messageHistoryData = await authService.getMessageHistoryData(userData.message_history);
        setMessageHistory(messageHistoryData);
        setCurrentUser(userData);
      }
    }
  }

  return (
    <UserProvider
      value={{user: currentUser, messageHistory: messageHistory, loggedIn: loggedIn,
      setUser: userData => {
        setCurrentUser(userData);
      },
      setMessageHistory: messageHistoryData => {
        setMessageHistory(messageHistoryData);
      }, 
      setLogin: isLoggedIn => {
        setLoggedIn(isLoggedIn);
      }}}
    >
      {props.children}
    </UserProvider>
  )
}

export default MyProvider;