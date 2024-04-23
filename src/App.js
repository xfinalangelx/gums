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
          <Route path="/forum" element={<Forum />} />
          <Route path="/event" element={<Events />} />
          <Route path="/registration" element={<RegistrationList />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
