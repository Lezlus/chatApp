import React, {useState} from 'react';
import authService from './services/authService';
import { useNavigate } from 'react-router';

const Register = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const registUser = async () => {
    await authService.registerUser({username: username, password: password});
    navigate('/login/');
  }

  const submitForm = (e) => {
    e.preventDefault();
    registUser();
  }

  return (
    <div className="container form-mobile-container">
      <form onSubmit={submitForm}>
        <h3 className="form-main-title">Please register</h3>
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

export default Register;