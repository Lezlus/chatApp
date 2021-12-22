import React, {useState, useContext} from 'react';
import UserContext from './context/context';
import authService from './services/authService';
import { useNavigate } from 'react-router';

const Login = (props) => {
  const userData = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const logUserIn = async () => {
    if (isAuthenticated(username, password)) {
      console.log("credentials are valid")
      const user = await authService.getData("3");
      console.log(user);
      const messageHistoryData = await authService.getMessageHistoryData(user.message_history);
      userData.setUser(user)
      userData.setMessageHistory(messageHistoryData)
      navigate("/");
    }
  }

  const isAuthenticated = (username, password) => {
    if (username === "1" && password === "1") {
      return true;
    }
    return false;
  }


  const submitForm = (e) => {
    e.preventDefault();
    console.log("logging in")
    logUserIn()
  }


  return (
    <div className="container">
      <form onSubmit={submitForm}>
        <h3>Please sign in</h3>
        <label htmlFor="username" className="sr-only">Username: </label>
        <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} 
              className="form-control" placeholder="Enter Username"/>
        <label htmlFor="password" className="sr-only">Password: </label>
        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} 
              className="form-control" placeholder="Enter Password"/>
        <button className="btn btn-lg btn-primary btn-block" type="submit">Log in</button> 
      </form> 
    </div>
  )
}

export default Login;