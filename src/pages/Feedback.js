import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Feedback = () => {
  const [fullName, setFullName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [document, setDocument] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [documentValidator, setDocumentValidator] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState();
  const [userFeedbackList, setUserFeedbackList] = useState([]);
  const [totalFeedbackList, setTotalFeedbackList] = useState([]);
  const token = sessionStorage.getItem("token");
  let obj = JSON.parse(token);
  const [update, setUpdate] = useState(false);
  const TABLE_HEAD = [
    "Author Name",
    "Email",
    "Matric Number",
    "Title",
    "Description",
    "Document",
    "Status",
  ];
  const mockData = [
    {
      title: "Test",
      description: "Testing description",
      status: "created",
      createdAt: "2024-01-06 13:42:09.71301+00",
    },
    {
      title: "Test",
      description: "Testing description",
      status: "created",
      createdAt: "2024-01-06 13:42:09.71301+00",
    },
    {
      title: "Test",
      description: "Testing description",
      status: "created",
      createdAt: "2024-01-06 13:42:09.71301+00",
    },
  ];

  let navigate = useNavigate();

  // Event handlers for input fields
  function handleFullName(event) {
    setFullName(event.target.value);
  }

  function handleMatricNumber(event) {
    setMatricNumber(event.target.value);
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

  // Fetch user role from Supabase
  async function roleSet() {
    const { data, error } = await supabase
      .from("userlist")
      .select("*")
      .eq("email", obj.user.email);

    if (error) {
      throw error;
    }

    setRole(data[0]?.role);
  }

  // Fetch all feedback lists
  async function fetchAllList() {
    const { data } = await supabase.from("feedbacks").select("*");
    setTotalFeedbackList(data);
  }

  // Initial data fetching on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/");
      }

      try {
        roleSet();
        const { data } = await supabase
          .from("feedbacks")
          .select("*")
          .eq("author_email", obj.user.email);

        setUserFeedbackList(data);
        fetchAllList();
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, [token, navigate, update]);

  // Submit feedback form
  async function submitFeedbackForm() {
    const { error, data } = await supabase
      .from("feedbacks")
      .insert({
        author_email: obj.user.email,
        author_name: fullName,
        author_matric: matricNumber,
        title: title,
        description: content,
        document: documentValidator,
      })
      .select();

    if (documentValidator) {
      const { res } = await supabase.storage
        .from("feedback")
        .upload(
          matricNumber + "feedbackdocument" + data[0].created_at,
          document
        );
    }

    // Update the state to trigger a re-render
    setUpdate((prevUpdate) => !prevUpdate);

    setOpen(true);
  }

  function convertDateFormat(inputDate) {
    // Parse the input date string
    const date = new Date(inputDate);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Define options for formatting
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    // Format the date using toLocaleString
    const formattedDate = date.toLocaleString("en-US", options);

    return formattedDate;
  }

  // Complete feedback status
  const completeFeedback = async (id) => {
    let { data, error } = await supabase.rpc(
      "update_feedback_status_completed",
      {
        feedback_id: id,
      }
    );
    window.location.reload();
  };

  // Process feedback status
  const processFeedback = async (id) => {
    let { data, error } = await supabase.rpc(
      "update_feedback_status_processing",
      {
        feedback_id: id,
      }
    );
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      {/* Conditionally renders the components based on user role */}
      {role === "admin" || role === "advisor" ? (
        <div>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <p className="font-normal leading-none opacity-70">
                      {head}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {totalFeedbackList.map(
                (
                  {
                    id,
                    author_email,
                    author_name,
                    author_matric,
                    title,
                    description,
                    document,
                    created_at,
                    status,
                  },
                  index
                ) => {
                  const isLast = index === totalFeedbackList.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={author_name}>
                      <td className={classes}>
                        <p className="font-normal">{author_name}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{author_email}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{author_matric}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{title}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{description}</p>
                      </td>
                      <td className={classes}>
                        {document ? (
                          <img
                            src={
                              "https://hvzzpfhyghxvhtfvtivo.supabase.co/storage/v1/object/public/feedback/" +
                              author_matric +
                              "feedbackdocument" +
                              created_at
                            }
                            alt="document"
                            className="w-20 h-20"
                          />
                        ) : (
                          <div>No docs</div>
                        )}
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col gap-2">
                          Current: {status}
                          <button
                            onClick={() => {
                              processFeedback(id);
                            }}
                            className="text-white text-md font-semibold bg-yellow-600 hover:bg-yellow-700 rounded-md px-4 py-2"
                          >
                            Processing
                          </button>
                          <button
                            onClick={() => {
                              completeFeedback(id);
                            }}
                            className="text-white text-md font-semibold bg-green-600 hover:bg-green-700 rounded-md px-4 py-2"
                          >
                            Completed
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 h-screen">
          <div className="col-span-1 w-full h-full bg-purple-600">
            <div className="m-6">
              <h1 className="text-white font-semibold text-2xl">
                My Feedbacks
              </h1>
            </div>
            <div className="h-[600px] overflow-y-auto">
              {userFeedbackList.length !== 0 ? (
                userFeedbackList?.map((x) => (
                  <div className="rounded-md px-4 py-2 bg-white mx-4 my-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-xl"> {x.title}</h3>
                      <p className="text-slate-400 text-md">
                        created on: {convertDateFormat(x.created_at)}
                      </p>
                    </div>
                    <div className="my-3">{x.description}</div>
                    <div className="w-full flex justify-end items-center uppercase font-bold">
                      {x.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white">No feedbacks</div>
              )}
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
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">Matric Number</label>
              <input
                type="text"
                id="matricNo"
                name="matricNo"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                onChange={handleMatricNumber}
              />
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
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-2 px-4 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
              onClick={() => submitFeedbackForm()}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;
