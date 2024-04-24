import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPass from "./pages/forgotpass/ForgotPass";
import ResetPass from "./pages/forgotpass/ResetPass";
import Privacy from "./pages/privacy/Privacy";
import UpdateProfile from "./pages/update/UPdateProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path='/forgotpassword' element={<ForgotPass/>}/>
        <Route path='/resetpassword/:id/:token/:username' element={<ResetPass/>}/>
        <Route path="/privacy&policy" element={<Privacy/>} />
        <Route path="/updateprofile/:id" element={<UpdateProfile/>}/>
      </Routes> 
    </BrowserRouter>
  );
}

export default App;