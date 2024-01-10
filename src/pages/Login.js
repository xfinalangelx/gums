import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  // Event handlers for input fields
  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  // Sign in with email and password
  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    // Log any error to the console
    console.log(error);

    // Clear the session token if there's an error
    if (error) {
      sessionStorage.clear("token");
    } else {
      // Set the user token and navigate to the home page on successful login
      setToken(data);
      navigate("/home");
    }
  }

  return (
    <div className="bg-white flex justify-center items-center h-screen">
      {/* Left section with logo and title */}
      <div className="w-full h-full hidden lg:flex lg:justify-center lg:items-center bg-purple-600">
        <h1 className="text-white font-black text-4xl">
          Girl Guide UM Management System
        </h1>
      </div>

      {/* Right section with login form */}
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={handleEmail}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={handlePassword}
          />
        </div>

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-2 px-4 w-full"
          onClick={() => signInWithEmail()}
        >
          Login
        </button>

        <div className="mt-6 text-blue-500 text-center flex flex-col gap-4">
          <a href="/register" className="hover:underline">
            Register Here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
