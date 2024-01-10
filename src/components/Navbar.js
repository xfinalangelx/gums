import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  let navigate = useNavigate();
  const [role, setRole] = useState();
  var token = sessionStorage.getItem("token");
  let obj = JSON.parse(token);
  async function fetchUserData(email) {
    const { data, error } = await supabase
      .from("userlist")
      .select("*")
      .eq("email", email);
    console.log(data);
    setRole(data[0]?.role);
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    sessionStorage.clear("token");
    navigate("/");
  }

  fetchUserData(obj.user.email);

  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
        <a
          href="/home"
          className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          Home
        </a>

        <a
          href="/feedback"
          className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          Feedback
        </a>

        {role === "admin" || role === "advisor" ? (
          <a
            href="/registration"
            className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
          >
            Registration List
          </a>
        ) : (
          <></>
        )}

        <a
          href="/account"
          className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          Account Settings
        </a>
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
