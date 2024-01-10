import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import approved from "../approved.svg";

const Account = () => {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState();
  let navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });
  let obj = JSON.parse(token);

  function handleNewPassword(event) {
    setNewPassword(event.target.value);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    sessionStorage.clear("token");
    navigate("/");
  }

  async function changePassword() {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setOpen(false);
  }

  return (
    <div className="h-screen">
      {open ? (
        <div
          className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-md overflow-auto py-8 px-10 w-[600px]">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <p className="font-semibold text-3xl text-center pt-1">
                Password Form
              </p>

              <div className="mb-4">
                <label className="block text-gray-600 text-center">
                  New Password
                </label>
                <input
                  type="password"
                  className="border px-4 py-2"
                  onChange={handleNewPassword}
                />
              </div>

              <button
                onClick={() => {
                  changePassword();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-2 px-4 w-full text-center"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md py-2 px-4 w-full text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Navbar />
      <div className="mt-36">
        <div className="mx-auto my-auto w-[500px]">
          <div className="bg-white rounded overflow-hidden shadow-lg">
            <div className="text-center p-6 bg-purple-600 border-b">
              (
              <svg
                aria-hidden="true"
                role="img"
                className="h-24 w-24 text-white rounded-full mx-auto"
                width="32"
                height="32"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M172 120a44 44 0 1 1-44-44a44 44 0 0 1 44 44Zm60 8A104 104 0 1 1 128 24a104.2 104.2 0 0 1 104 104Zm-16 0a88 88 0 1 0-153.8 58.4a81.3 81.3 0 0 1 24.5-23a59.7 59.7 0 0 0 82.6 0a81.3 81.3 0 0 1 24.5 23A87.6 87.6 0 0 0 216 128Z"
                ></path>
              </svg>
              <p className="pt-2 text-lg font-semibold text-gray-50">
                {obj.user.email}
              </p>
            </div>
            <div className="border-b">
              <button
                className="px-4 py-6 hover:bg-gray-100 flex flex-1 w-full"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <div className="text-green-600">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                  >
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="pl-3">
                  <p className="text-sm font-medium text-gray-800 leading-none">
                    Change Password
                  </p>
                  <p className="text-xs text-gray-500 pl-3">
                    Change User Password
                  </p>
                </div>
              </button>
            </div>

            <div>
              <button
                onClick={() => {
                  signOut();
                }}
                className="w-full px-4 py-5 pb-4 hover:bg-gray-100 flex items-center"
              >
                <p className="text-sm font-medium text-red-500 leading-none">
                  Logout
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
