import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Feedback = () => {
  const [role, setRole] = useState();
  const [userFeedbackList, setUserFeedbackList] = useState([]);
  const [totalFeedbackList, setTotalFeedbackList] = useState([]);
  const token = sessionStorage.getItem("token");
  let obj = JSON.parse(token);
  const [update, setUpdate] = useState(false);
  const TABLE_HEAD = [
    "Full Name",
    "Email",
    "Title",
    "Description",
    "Document",
    "Status",
  ];

  let navigate = useNavigate();

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
                              author_email +
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
          <div className="col-span-1 w-full h-full bg-green-600">
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
        </div>
      )}
    </>
  );
};

export default Feedback;
