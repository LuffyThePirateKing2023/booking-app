import React, { useState } from 'react';
import './forgotpass.css';
import img from '../../res/background.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const ForgotPass = () => {
    const [loading, setLoading] = useState(false);
    const [email, setemail] = useState('');
    const [message, setmessage] = useState('');
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8800/api/auth/forgotpassword', { email });
            setmessage(response.data.message);
            setLoading(false);
            if (response.data.message === "Email sent Succesfully. Please check your Inbox and Spam Folder") {
                setTimeout(() => {
                    navigate('/login');
                }, 2500);
            }
        } catch (err) {
            setmessage(err.response.data.message);
            setLoading(false);
        }
    }
    

  return (
    <div className='forgot-pass'>
        <img src={img} alt="" />
      <div className="forgot-content form-box">
            <div className="form forgot-form">
                <span className='formHeader'>Welcome to MERNStack Booking</span>
                <span className="title">Forgot Password</span>
                <span className="subtitle forgot-subtitle">Please Provide your Email</span>
                <input type="email"
                 name="email" 
                 id="email" 
                 placeholder='Email' 
                 value={email}
                 onChange={(e) => setemail(e.target.value)}
                 required
                 />
                <button disabled={loading} onClick={onSubmit}>Submit</button>
                {message && <p className='message'>{message}</p>}
            </div>
            <div className="forLogin">
                <Link to ="/login"><FaTimes/></Link>
            </div>
      </div>
    </div>
  )
}

export default ForgotPass
