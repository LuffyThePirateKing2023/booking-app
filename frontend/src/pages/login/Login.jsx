import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import img from '../../res/background.jpg';
import {FaTimes, FaEye, FaEyeSlash} from 'react-icons/fa'

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setremberMe] = useState(false)
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const storedCheckbox = localStorage.getItem('checkbox');

    if(storedCheckbox && storedCheckbox !== ''){
      setremberMe(true);
      setCredentials({
        username: storedUsername,
        password: storedPassword
      });
      document.getElementById('username').value = storedUsername;
      document.getElementById('password').value = storedPassword;
    }
  },[])

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  //handle the login button
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      localStorage.setItem('isLogin', "true")
      navigate("/");
      if(rememberMe){
        localStorage.setItem('username', credentials.username);
        localStorage.setItem('password', credentials.password);
        localStorage.setItem('checkbox', 'checked')
      }
      else{
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('checkbox');
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  //toggle close icon for login page
  const closeIcon = async (e) => {
    e.preventDefault();
    navigate('/')
  }
//toggle show and hide password
  const passwordVisible = () => {
    setShowPassword(!showPassword);
  };

//save credentials
  const handleRememberMe = (e) => {
    setremberMe(e.target.checked)
  }
  return (
    <div className="login">
      <img src={img} />
        <div className="form-box form-login">  
            <form className="form">
            <FaTimes className="close" onClick={closeIcon}/>
                <span className='formHeader'>Welcome to MERNStack Booking</span>
                <span className="title">Sign In</span>
                <span className="subtitle">Log in to your account</span>
                <div className="form-container">
                  <input id='username' type="text" className="input" placeholder="UserName" onChange={handleChange} />
                  <div className="password-content">
                    <input id='password' type={showPassword? "text" : "password"}
                    className="input" placeholder=" ******" onChange={handleChange} />
                    {showPassword ? 
                    <FaEye onClick={passwordVisible} className="showpass"/> :
                    <FaEyeSlash onClick={passwordVisible} className="showpass"/>}
                  </div>                
                </div>
                <div className="rememberMe">
                  <label>
                    <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} />
                    Remember me
                  </label>
                  <Link to='/forgotpassword'><p>Forgot Password?</p></Link>
                </div>
                <button disabled={loading} onClick={handleClick}>Log in</button>
                {error && <span className="errorMessage">{error.message}</span>}
            </form>
            <div className="form-section login-form-section">
            <p>Don't have an account? <Link to='/register'>Sign Up</Link> </p>
          </div>
        </div>
    </div>
  );
};

export default Login;