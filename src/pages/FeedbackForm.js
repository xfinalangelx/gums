import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import approved from "../approved.svg";

const FeedbackForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [documentValidator, setDocumentValidator] = useState(false);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  // Event handlers for input fields
  function handleFullName(event) {
    setFullName(event.target.value);
  }

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handleTitle(event) {
    setTitle(event.target.value);
  }
  function handleContent(event) {
    setContent(event.target.value);
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
      title.length < 1 ||
      content.length < 1
    );
  }

  // Submit feedback form
  async function submitFeedbackForm() {
    const { error, data } = await supabase
      .from("feedbacks")
      .insert({
        author_email: email,
        author_name: fullName,
        title: title,
        description: content,
        document: documentValidator,
      })
      .select();

    if (documentValidator) {
      const { res } = await supabase.storage
        .from("feedback")
        .upload(email + "feedbackdocument" + data[0].created_at, document);
    }

    // Update the state to trigger a re-render
    setUpdate((prevUpdate) => !prevUpdate);

    setOpen(true);
    setEmail("");
    setFullName("");
    setTitle("");
    setContent("");
  }

  return (
    <div>
      {open ? (
        // Success Modal
        <div
          className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-md overflow-auto py-8 px-10 w-[600px]">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <p className="font-semibold text-3xl text-center pt-1">
                Your feedback has been submitted!
              </p>
              <img src={approved} alt="approved" className="h-20 w-20" />
              <p className="font-medium text-lg text-center pt-[10px]">
                Please wait for 3-5 working days for a reply.
              </p>
              <a
                href="/"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 w-full text-center"
              >
                Back to Home Page
              </a>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full bg-green-800 text-white py-5 px-4 flex justify-between items-center">
        <a
          href="/"
          className="font-semibold text-white text-lg flex items-center gap-2"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <svg
              height="800"
              width="800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 511.999 511.999"
            >
              <path
                fill="#6cd800"
                d="m420.364 255.999-185.261-20.898L256 420.364c9.672 24.942 23.54 48.725 43.281 68.465 30.894 30.894 80.984 30.894 111.878 0 15.089-15.089 22.788-34.758 23.137-54.532 19.775-.35 39.443-8.048 54.532-23.137 30.895-30.894 30.895-80.984 0-111.878-19.74-19.742-43.523-33.611-68.464-43.283"
              />
              <path
                fill="#53b400"
                d="M420.364 255.999c24.942-9.672 48.725-23.54 68.465-43.281 30.895-30.895 30.895-80.984 0-111.878-15.089-15.089-34.757-22.788-54.532-23.137-.35-19.775-8.048-39.443-23.137-54.532-30.894-30.894-80.984-30.894-111.878 0-19.74 19.74-33.609 43.523-43.281 68.465l-20.898 164.363z"
              />
              <path
                fill="#93f340"
                d="M91.637 255.999c-24.942 9.672-48.725 23.54-68.466 43.281-30.894 30.895-30.894 80.984 0 111.878 15.089 15.089 34.757 22.788 54.532 23.137.35 19.775 8.048 39.443 23.137 54.532 30.895 30.895 80.984 30.895 111.878 0 19.741-19.741 33.609-43.524 43.281-68.465V235.101z"
              />
              <path
                fill="#6cd800"
                d="M256 91.636c-9.672-24.942-23.54-48.725-43.281-68.465-30.895-30.894-80.984-30.894-111.878 0-15.089 15.088-22.788 34.757-23.138 54.531-19.775.35-39.443 8.048-54.532 23.137-30.894 30.894-30.894 80.984 0 111.878 19.741 19.741 43.524 33.61 68.466 43.282H256z"
              />
              <path
                fill="#93f340"
                d="m381.705 152.46-22.166-22.165L256 233.834l-10.449 22.165L256 278.165l103.539 103.539 22.166-22.166-103.539-103.539z"
              />
              <path
                fill="#cfffa5"
                d="m152.461 130.295-22.165 22.165 103.539 103.539-103.539 103.539 22.165 22.166L256 278.165v-44.331z"
              />
            </svg>
          </div>
          PPPSUM
        </a>
        <div className="flex items-center gap-4 font-semibold">
          <a href="/feedbackform" className="hover:text-green-400">
            Feedback
          </a>
          <a href="/" className="hover:text-green-400">
            Sponsor Us
          </a>
          <a href="/gallery" className="hover:text-green-400">
            Gallery
          </a>
          <a href="/about" className="hover:text-green-400">
            About Us
          </a>
        </div>
      </div>

      <div className="col-span-1 mt-10 my-6 mx-6">
        <h1 className="text-2xl font-semibold mb-4">Feedback Form</h1>
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
            <small className="text-red-400">Please enter email</small>
          ) : (
            <></>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600">Feedback Title</label>
          <input
            type="text"
            id="matricNo"
            name="matricNo"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={handleTitle}
          />
          {title.length < 1 ? (
            <small className="text-red-400">Please enter feedback title</small>
          ) : (
            <></>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600">Feedback Content</label>
          <textarea
            type="text"
            id="matricNo"
            name="matricNo"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            onChange={handleContent}
          />
          {content.length < 1 ? (
            <small className="text-red-400">
              Please enter feedback content
            </small>
          ) : (
            <></>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600">Feedback Attachment</label>
          <input
            type="file"
            id="documents"
            name="documents"
            className="py-2"
            onChange={handleDocument}
          />
        </div>

        <button
          disabled={validator()}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
          onClick={() => submitFeedbackForm()}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
