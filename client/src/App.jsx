import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import ChatBot from "./Pages/ChatBot/ChatBot.jsx";
import axios from "axios";
import "./App.css";
import { Toaster } from "react-hot-toast";

console.log("REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<ChatBot />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
