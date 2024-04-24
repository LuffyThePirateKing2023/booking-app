import React from 'react';
import { useContext, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { RegContext } from '../../context/RegContext';
import axios from "axios";
import "./register.css";
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import img from '../../res/background.jpg'

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: undefined,
    username: undefined,
    email: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(RegContext);

  const navigate = useNavigate();
  const popUp = document.getElementById("confirmation");
  const navigatePopUp =  () => {
    popUp.classList.add('open-confirmation')
  }

  const setChange = (e) => {
    setCredentials((prev) => ({...prev, [e.target.id]: e.target.value}))
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({type: "REGISTRATION_START"});
    try{
      const res = await axios.post("http://localhost:8800/api/auth/register", credentials);
      dispatch({ type: "REGISTRATION_SUCCESS", payload: res.data.details });
      navigatePopUp();
    }
    catch(error){
      dispatch({type: "REGISTRATION_FAILURE", payload: error.response.data})
    }
  }
  const doneSubmit = async(e) => {
    e.preventDefault();
    navigate('/login')
  };
  const closeIcon = async (e) => {
    e.preventDefault();
    navigate('/')
  }
  return (
    <div className="main">
      <img src={img} />
            <div className="form-box">
              <form className="form">
                 <FaTimes className="close" onClick={closeIcon}/>
                  <span className='formHeader'>Welcome to MERNStack Booking</span>
                  <span className="title">Sign up</span>
                  <span className="subtitle">Create a free account to see the full features of the app.</span>
                  <div className="form-container">
                    <input id='name' type="text" className="input" placeholder="Full Name" onChange={setChange} />
                    <input id='username' type="text" className="input" placeholder="User Name" onChange={setChange} />
                    <input id='email' type="email" className="input" placeholder="Email" onChange={setChange} />
                    <input id='password' type="password" className="input" placeholder="Password" onChange={setChange} />
                  </div>
                  <button disabled={loading} onClick={handleClick}>Sign up</button>
              </form>
            <div className="form-section">
              <p>Have an account? <Link to='/login'>Log in</Link> </p>
            </div>  
            </div>
            <div className="confirmation" id='confirmation'>
              <div className="confirm-content">
                  < FaCheckCircle className='logo' />
                  <h2>Thank You!</h2>
                  <p>Your details has been successfully submitted. Thanks!</p>
                    <button onClick={doneSubmit}>Proceed to Login</button>
              </div>
             </div>
    </div>
  )
}

export default Register
