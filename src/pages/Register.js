import React, { useState } from "react";
import approved from "../approved.svg";
import { supabase } from "../supabaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [role, setRole] = useState("");
  const [document, setDocument] = useState();
  const [documentValidator, setDocumentValidator] = useState(false);
  const [open, setOpen] = useState(false);

  // Event handlers for input fields
  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handleFullName(event) {
    setFullName(event.target.value);
  }

  function handleMatricNumber(event) {
    setMatricNumber(event.target.value);
  }

  function handleRole(event) {
    setRole(event.target.value);
  }

  function handleDocument(event) {
    setDocument(event.target.files[0]);
    setDocumentValidator(true);
  }

  // Form validation function
  function validator() {
    return (
      email.length < 1 ||
      fullName.length < 1 ||
      matricNumber.length < 1 ||
      role.length < 1 ||
      !documentValidator
    );
  }

  // Submit registration form
  async function submitRegistrationForm() {
    const { error, data } = await supabase.from("registration").insert({
      email: email,
      fullName: fullName,
      matricNumber: matricNumber,
      role: role,
    });

    const { res } = await supabase.storage
      .from("documents")
      .upload(matricNumber + "document", document);

    // Open the success modal
    setOpen(true);
  }

  return (
    <>
      {open ? (
        // Success Modal
        <div
          className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-md overflow-auto py-8 px-10 w-[600px]">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <p className="font-semibold text-3xl text-center pt-1">
                Form successfully sent!
              </p>
              <img src={approved} alt="approved" className="h-20 w-20" />
              <p className="font-medium text-lg text-center pt-[10px]">
                Registration form is submitted, please wait for the
                advisor/admin to approve this registration.
              </p>
              <a
                href="/"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 w-full text-center"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Main Registration Form */}
      <div className="bg-white flex justify-center items-center h-screen">
        <div className="w-full h-full hidden lg:flex lg:justify-center lg:items-center bg-green-600">
          <h1 className="text-white font-black text-4xl">PPPSUM</h1>
        </div>

        <div className="lg:px-36 md:px-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold mb-4">Registration Form</h1>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              onChange={handleEmail}
            />
            {email.length < 1 ? (
              <small className="text-red-400">Please enter valid email</small>
            ) : (
              <></>
            )}
          </div>

          {/* Full Name Input */}
          <div className="mb-4">
            <label className="block text-gray-600">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              onChange={handleFullName}
            />
            {fullName.length < 1 ? (
              <small className="text-red-400">Please enter full name</small>
            ) : (
              <></>
            )}
          </div>

          {/* Matric Number Input */}
          <div className="mb-4">
            <label className="block text-gray-600">Matric Number</label>
            <input
              type="text"
              id="matricNo"
              name="matricNo"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              onChange={handleMatricNumber}
            />
            {matricNumber.length < 1 ? (
              <small className="text-red-400">Please enter matric number</small>
            ) : (
              <></>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-600">Role</label>
            <div className="flex flex-col gap-2">
              <select
                required
                name="role"
                id="role"
                className="px-5 py-2 border border-gray-300"
                onChange={handleRole}
                placeholder="test"
              >
                <option value="" disabled selected>
                  Please select your role
                </option>
                <option value="admin">Admin</option>
                <option value="advisor">Advisor</option>
                <option value="member">Member</option>
              </select>
              {role.length < 1 ? (
                <small className="text-red-400">Please select role</small>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Document Upload Input */}
          <div className="mb-4">
            <label className="block text-gray-600">
              Verification Documents
            </label>
            <input
              type="file"
              id="documents"
              name="documents"
              className="py-2"
              onChange={handleDocument}
            />
            {!documentValidator ? (
              <small className="text-red-400">
                Please upload verification document for registration
              </small>
            ) : (
              <></>
            )}
          </div>

          {/* Submit Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
            disabled={validator()}
            onClick={() => submitRegistrationForm()}
          >
            Submit Registration
          </button>

          {/* Login Link */}
          <div className="mt-6 text-blue-500 text-center flex flex-col gap-4">
            <a href="/" className="hover:underline">
              Have an account? Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
