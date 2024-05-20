import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  // State to store the user's role
  const [role, setRole] = useState();

  // Access token from session storage
  const token = sessionStorage.getItem("token");
  const obj = JSON.parse(token);

  // Navigation hook to redirect users
  const navigate = useNavigate();

  // Function to fetch user data based on email
  async function fetchUserData(email) {
    try {
      // Fetch user data from Supabase
      const { data, error } = await supabase
        .from("userlist")
        .select("*")
        .eq("email", email);

      // Set the user's role in the component state
      setRole(data[0]?.role);
    } catch (error) {
      // Log any errors that occur during the data fetching process
      console.error("Error fetching user data:", error.message);
    }
  }

  // Function to handle user sign-out
  async function signOut() {
    try {
      // Sign out the user using Supabase auth
      const { error } = await supabase.auth.signOut();

      // Clear the session storage token
      sessionStorage.clear("token");

      // Redirect the user to the home page
      navigate("/");
    } catch (error) {
      // Log any errors that occur during the sign-out process
      console.error("Error signing out:", error.message);
    }
  }

  // Use useEffect to fetch user data when the component mounts
  useEffect(() => {
    // Check if there's a valid token
    if (!token) {
      // If not, redirect the user to the home page
      navigate("/");
    }

    // Fetch user data based on the user's email
    fetchUserData(obj.user.email);
  }, [token, navigate]);

  if (role === "advisor") {
    return (
      // Navbar UI
      <nav className="bg-green-800">
        <div className="container flex items-center justify-center p-6 mx-auto text-white capitalize">
          {/* Home Link */}
          <a
            href="/home"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform  hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Home
          </a>

          {/* Registration List Link (conditionally rendered based on user role) */}
          <a
            href="/registration"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Registration List
          </a>

          {/* Forum List Link (conditionally rendered based on user role) */}
          <a
            href="/forum"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Forum
          </a>
          <a
            href="/users"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Users
          </a>

          <a
            href="/ads"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Manage Ads
          </a>

          <a
            href="/managegallery"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Manage Gallery
          </a>

          <a
            href="/attendance"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Manage Attendance
          </a>

          {/* Account Settings Link */}
          <a
            href="/account"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Account Settings
          </a>

          {/* Logout Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 "
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </nav>
    );
  } else if (role === "admin") {
    return (
      // Navbar UI
      <nav className="bg-green-800">
        <div className="container flex items-center justify-center p-6 mx-auto text-white capitalize">
          {/* Home Link */}
          <a
            href="/home"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform  hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Home
          </a>

          {/* Registration List Link (conditionally rendered based on user role) */}
          <a
            href="/registration"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Registration List
          </a>

          <a
            href="/event"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Events
          </a>

          {/* Account Settings Link */}
          <a
            href="/account"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Account Settings
          </a>

          {/* Logout Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 "
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </nav>
    );
  } else {
    return (
      // Navbar UI
      <nav className="bg-green-800">
        <div className="container flex items-center justify-center p-6 mx-auto text-white capitalize">
          {/* Home Link */}
          <a
            href="/home"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform  hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Home
          </a>

          <a
            href="/event"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Events
          </a>

          {/* Account Settings Link */}
          <a
            href="/account"
            className="border-b-2 border-transparent hover:text-green-600 transition-colors duration-300 transform hover:border-green-500 mx-1.5 sm:mx-6"
          >
            Account Settings
          </a>

          {/* Logout Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 "
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </nav>
    );
  }
};

export default Navbar;
