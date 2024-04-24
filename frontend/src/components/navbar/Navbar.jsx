import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
import defaultProfile from '../../res/defaultProfile.png';
import {FaChevronDown} from 'react-icons/fa'

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const Navigate = useNavigate();

  const showSetting = () => {
    const show = document.getElementById('showbtn');
    if (show.style.display === 'none') {
      show.style.display = 'block';
    } else {
      show.style.display = 'none';
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    Navigate(`/updateprofile/${user._id}`);
  }
  
  const privacybtn = async (e) => {
    e.preventDefault();
    Navigate('/privacy&policy');
  };

  const showLogout = () =>{
    const container = document.getElementById('logoutBtn');
    if(container.style.display === "none"){
      container.style.display = 'block'
    }
    else{
      container.style.display = 'none'
    }
  };

  const logOutbtn = async (e) => {
    const container = document.getElementById('logoutBtn');
    const show = document.getElementById('showbtn');
    e.preventDefault();
    dispatch({type: "LOGOUT"});
    if(show.style.display === "block" && container.style.display === 'block'){
      show.style.display = 'none';
      container.style.display = 'none'
    }
  };
  
  const cancelBtn = async (e) =>{
    e.preventDefault();
    const container = document.getElementById('logoutBtn');
    const show = document.getElementById('showbtn')
    if(show.style.display === "block" && container.style.display === 'block'){
      show.style.display = 'none';
      container.style.display = 'none'
    }
    Navigate('/')
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="liLogo">
          <span className="navlogo">MERNStack Booking</span>
        </Link>
        {user ? 
        <div className="navItems profilePic">
            <div className="defprofilePic">
              <div className="imgcontent">
                <img src={user.img || defaultProfile } alt='profilePic' />
              </div>
              <div className="nameContent">
                <h4 className="username">{user.name}</h4>
                <p>@{user.username}</p>
              </div>
            </div>
            <button className="navBtn headerBtn" onClick={showSetting}><FaChevronDown/></button>
        </div>
        : (
          <div className="navItems">
            <Link to="/register" style={{ color: "inherit", textDecoration: "none" }}>
               <button className="navButton headerBtn">Register</button>
            </Link>
            <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>
            <button className="navButton headerBtn">Login</button>
            </Link>
          </div>
        )}
      </div>
      <div className="settinginfo" id="showbtn">
        <ul>
          <li onClick={updateProfile}>Update Profile</li>
          <li onClick={privacybtn}>Privacy & Policy</li>
          <li onClick={showLogout}>Logout</li>
        </ul>
      </div>
      <div className="logoutbtn" id="logoutBtn">
          <div className="logoutbtn-container">
            <p>Are you sure to logout?</p>
            <div className="btnlogout">
                <button onClick={cancelBtn}>Cancel</button>
                <button onClick={logOutbtn}>OK</button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Navbar;