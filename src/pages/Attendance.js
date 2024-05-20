import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Attendance = () => {
  const [totalAttendanceList, setTotalAttendanceList] = useState([]);
  const [totalEventList, setTotalEventList] = useState([]);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState();
  const token = sessionStorage.getItem("token");
  let obj = JSON.parse(token);
  const [update, setUpdate] = useState(false);
  const [link, setLink] = useState("");

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
  async function fetchAllList(id) {
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("event_id", id);
    setTotalAttendanceList(data);
  }

  // Fetch all feedback lists
  async function fetchAllEventList() {
    const { data } = await supabase.from("events").select("*");
    setTotalEventList(data);
  }

  function openAttendance(id) {
    fetchAllList(id);
    setOpen(true);
  }

  // Initial data fetching on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/");
      }
      fetchAllEventList();
      try {
        roleSet();
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

  return (
    <>
      <Navbar />
      {/* Conditionally renders the components based on user role */}
      <div>
        {/* Attendance details modal */}
        {open ? (
          <div
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white rounded-md overflow-auto py-8 px-10 w-[600px]">
              <div className="w-full flex flex-col items-center justify-center gap-4">
                <div className="font-semibold text-lg py-4">
                  List of Attendees
                </div>
                {totalAttendanceList.map((x) => (
                  <div className="py-3">{x.emails}</div>
                ))}
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
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <p className="font-normal leading-none opacity-70">
                  Event Name
                </p>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <p className="font-normal leading-none opacity-70">
                  Event Description
                </p>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <p className="font-normal leading-none opacity-70">
                  Created At
                </p>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 flex justify-end">
                <p className="font-normal leading-none opacity-70">Action</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {totalEventList.map(
              ({ id, created_at, title, description }, index) => {
                const isLast = index === totalEventList.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={id}>
                    <td className={classes}>
                      <div className="">{title}</div>
                    </td>
                    <td className={classes}>
                      <div className="max-w-[300px] max-h-[50px] overflow-auto">
                        {description}
                      </div>
                    </td>
                    <td className={classes}>
                      <p className="font-normal">
                        {convertDateFormat(created_at)}
                      </p>
                    </td>

                    <td className={classes + " flex justify-end items-center"}>
                      <button
                        onClick={() => openAttendance(id)}
                        className="text-white text-md font-semibold bg-green-600 hover:bg-green-700 rounded-md px-4 py-2"
                      >
                        View Attendance Details
                      </button>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Attendance;
