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

  return (
    // Navbar UI
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
        {/* Home Link */}
        <a
          href="/home"
          className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          Home
        </a>

        {/* Feedback Link */}
        <a
          href="/feedback"
          className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          Feedback
        </a>

        {/* Registration List Link (conditionally rendered based on user role) */}
        {role === "admin" || role === "advisor" || !role ? (
          <a
            href="/registration"
            className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
          >
            Registration List
          </a>
        ) : (
          <></>
        )}

        {/* Forum List Link (conditionally rendered based on user role) */}
        {role === "advisor" ? (
          <a
            href="/forum"
            className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
          >
            Forum
          </a>
        ) : (
          <></>
        )}

        <a
          href="/event"
          className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          Events
        </a>

        {role === "advisor" ? (
          <a
            href="/users"
            className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
          >
            Users
          </a>
        ) : (
          <></>
        )}

        {/* Account Settings Link */}
        <a
          href="/account"
          className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          Account Settings
        </a>

        {/* Logout Button */}
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-2 px-4 "
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
