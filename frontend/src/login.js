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
    const data = await authService.loginAuthUser({username: username, password: password})
    localStorage.setItem('token', data.token);
    console.log("credentials are valid")
    const user = data.user;
    console.log(user);
    const messageHistoryData = await authService.getMessageHistoryData(user.message_history);
    console.log(messageHistoryData)
    userData.setUser(user);
    userData.setLogin(true);
    userData.setMessageHistory(messageHistoryData);
    navigate("/");
  }

  const submitForm = (e) => {
    e.preventDefault();
    console.log("logging in")
    logUserIn()
  }


  return (
    <div className="container form-mobile-container">
      <form onSubmit={submitForm}>
        <h3 className="form-main-title">Please sign in</h3>
        <div className="form-group">
          <label htmlFor="username" className="sr-only">Username: </label>
          <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} 
                className="form-control" placeholder="Enter Username"/>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="sr-only">Password: </label>
          <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} 
                className="form-control" placeholder="Enter Password"/>
        </div>
        <button className="btn btn-sm form-button" type="submit">Log in</button> 
      </form> 
    </div>
  )
}

export default Login;