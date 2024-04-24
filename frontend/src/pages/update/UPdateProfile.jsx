    import React, { useContext, useState, } from 'react';
    import { useNavigate} from "react-router-dom"
    import './updateprofile.css';
    import { AuthContext } from '../../context/AuthContext';
    import img from '../../res/background.jpg';
    import axios from 'axios';
    import Cookie from 'js-cookie';

    const UPdateProfile = () => {
        const {user} = useContext(AuthContext);
        const [avatarPreview, setAvatarPreview] = useState(null);
        const Navigate = useNavigate();
        const [error, setError] = useState(null);

        const handleUpdateInfo = async (e) => {
            e.preventDefault();
            try{
                const token = Cookie.get("access_token")
                console.error('accesstoken',token);
                const res = await axios.put(`http://localhost:8800/api/users/${user._id}`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if(res && res.status === 200){
                    Navigate('/')
                }
                else{
                    console.error("Failed to update user data!",res)
                    console.log("Failed to update user data!", res)
                }
            }
            catch(err){
                console.error(err.response.data)
                setError(err)
            }
        };


        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };

        const timestamp = () => {
            const memberSince = new Date(user.createdAt);
            const formatOption = { year:"numeric", month: "long", day:"numeric"};
            return memberSince.toLocaleDateString(undefined, formatOption);
        };

        const cancelBtn = (e) => {
            e.preventDefault();
            Navigate('/')
        }
    return (
        <div className='update'>
            <img className='updateimg' src={img} alt="" />
            <div className="update-content">
                <div className="avatar">
                    <h2>{user.name}</h2>
                    <p>@ {user.username}</p>
                    <div className="avatarPic">
                        <div className="avatarImg" id='avatarImg'>
                            {avatarPreview &&  <img src={avatarPreview} alt="" /> } 
                        </div>
                        <label htmlFor="file">Upload New Photo</label>
                        <input type="file" accept='image/*' id='file' style={{display:'none'}} onChange={handleFileChange}/>
                    </div>
                    <div className="avatar-info">
                        <p>Upload a new avatar. Larger imgage will be resized automatically.</p>
                        <p>Maximum upload size is <span>1 MB</span></p>
                    </div>
                    <div className="timestamp">
                        <p>Member since : 
                            <span className='fortimestamp'>{timestamp()}</span>
                        </p>
                    </div>
                </div>
                <div className="forUpdate">
                    <h1>Edit Profile</h1>
                    <h5>User Info.</h5>
                    <div className="forUpdate-content">
                        <input type="text" placeholder='Your name'  />
                        <input type="text" placeholder='Username' />
                        <input type="password" placeholder='Password' id='password1'/>
                        <input type="password" placeholder='Confirm Password' id='password2'/>
                        <input type="email" placeholder='Email Address' />
                        <input type="text" placeholder='Contact Number'/>
                        <input type="text"  placeholder='Address'/>
                    </div>
                    <div className="button-content">
                        <button onClick={handleUpdateInfo}>Update Info</button>
                        {error && <span className="errorMessage">{error.message}</span>}
                        <button onClick={cancelBtn}>Cancel</button>
                    </div>                
                </div>
            </div>
        </div>
    )
    }

    export default UPdateProfile
