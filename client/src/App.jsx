import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import ChatBot from "./Pages/ChatBot/ChatBot.jsx";
import axios from "axios";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

console.log("REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register", "/"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      <Analytics />
      <SpeedInsights />
      {!shouldHideNavbar && <Navbar />}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatBot />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
