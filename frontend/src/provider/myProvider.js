import authService from "../services/authService";
import {UserProvider} from '../context/context';
import { useEffect, useState } from 'react';

const MyProvider = (props) => {
  const [currentUser, setCurrentUser] = useState({});
  const [messageHistory, setMessageHistory] = useState({});

  return (
    <UserProvider
      value={{user: currentUser, messageHistory: messageHistory,
      setUser: userData => {
        setCurrentUser(userData);
      },
      setMessageHistory: messageHistoryData => {
        setMessageHistory(messageHistoryData);
      }}}
    >
      {props.children}
    </UserProvider>
  )
}

export default MyProvider;