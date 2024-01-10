import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(error);
    if (error) {
      sessionStorage.clear("token");
    } else {
      setToken(data);
      navigate("/home");
    }
  }

  return (
    <div class="bg-white flex justify-center items-center h-screen">
      <div class="w-full h-full hidden lg:flex lg:justify-center lg:items-center bg-purple-600">
        <h1 class="text-white font-black text-4xl">
          Girl Guide UM Management System
        </h1>
      </div>

      <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 class="text-2xl font-semibold mb-4">Login</h1>
        <div class="mb-4">
          <label for="email" class="block text-gray-600">
            Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={handleEmail}
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={handlePassword}
          />
        </div>

        <button
          class="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-2 px-4 w-full"
          onClick={() => signInWithEmail()}
        >
          Login
        </button>

        <div class="mt-6 text-blue-500 text-center flex flex-col gap-4">
          <a href="/register" class="hover:underline">
            Register Here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
