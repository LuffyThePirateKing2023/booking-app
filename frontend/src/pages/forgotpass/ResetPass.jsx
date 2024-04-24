import React, { useEffect, useState } from 'react';
import './forgotpass.css';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import img from '../../res/background.jpg';
import axios from 'axios';

function ResetPass({location}) {
    const navigate = useNavigate();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const {id, username, token} = useParams();

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'password1') {
            setPassword1(value);
            setPasswordError('');
        } else if (id === 'password2') {
            setPassword2(value);
            setConfirmPasswordError('');
        }
    };

    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password1 || !password2) {
            setPasswordError('Please input password');
            setConfirmPasswordError('');
            return;
        }
        if (password1 !== password2) {
            setPasswordError('');
            setConfirmPasswordError('Passwords don\'t match');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8800/api/auth/resetpassword/${id}/${token}`, { password: password1 });
            console.log(response);
            navigate('/login');
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    const closeIcon = async (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className="login">
            <img src={img} />
            <div className="form-box form-login">
                <form className="form reset-form">
                    <FaTimes className="close" onClick={closeIcon} />
                    <span className="title">Welcome back! @{username}</span>
                    <span className="subtitle">Enter your new password</span>
                    <div className="form-container">
                        <div className="password-content">
                            <input
                                id='password1'
                                type={showPassword1 ? "text" : "password"}
                                className="input"
                                placeholder="Enter New Password"
                                value={password1}
                                onChange={handleChange}
                            />
                            {showPassword1 ?
                                <FaEyeSlash onClick={togglePasswordVisibility1} className="showpass" /> :
                                <FaEye onClick={togglePasswordVisibility1} className="showpass" />}
                        </div>
                        {passwordError && <span className="errorMessage">{passwordError}</span>}
                        <div className="password-content">
                            <input
                                id='password2'
                                type={showPassword2 ? "text" : "password"}
                                className="input"
                                placeholder="Confirm New Password"
                                value={password2}
                                onChange={handleChange}
                            />
                            {showPassword2 ?
                                <FaEyeSlash onClick={togglePasswordVisibility2} className="showpass" /> :
                                <FaEye onClick={togglePasswordVisibility2} className="showpass" />}
                        </div>
                        {confirmPasswordError && <span className="errorMessage">{confirmPasswordError}</span>}
                    </div>
                    <button disabled={loading} onClick={handleResetPassword}>Reset Password</button>
                    {error && <span className="errorMessage">{error.message}</span>}
                </form>
            </div>
        </div>
    );
}

export default ResetPass;
