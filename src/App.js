import "./App.css";
import { supabase } from "./supabaseClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Feedback from "./pages/Feedback";
import RegistrationList from "./pages/RegistrationList";
import Account from "./pages/Account";
import { useEffect, useState } from "react";
import Forum from "./pages/Forum";
import Events from "./pages/Events";
import UserList from "./pages/UserList";
import FeedbackForm from "./pages/FeedbackForm";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import ManageAds from "./pages/ManageAds";
import ManageGallery from "./pages/ManageGallery";
import Attendance from "./pages/Attendance";

function App() {
  // Log the supabase object to the console
  console.log(supabase);

  // State to manage the user token
  const [token, setToken] = useState(false);

  // Save the token to sessionStorage if it exists
  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }

  // Check sessionStorage for an existing token on initial load
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      // Parse the token and set it to the state
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        {/* Define routes for different pages */}
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/feedbackform" element={<FeedbackForm />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/ads" element={<ManageAds />} />
          <Route path="/managegallery" element={<ManageGallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/event" element={<Events />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/registration" element={<RegistrationList />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
