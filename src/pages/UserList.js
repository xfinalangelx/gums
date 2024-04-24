import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const UserList = () => {
  const [role, setRole] = useState();
  const [totalUserList, setTotalUserList] = useState([]);
  const token = sessionStorage.getItem("token");
  let obj = JSON.parse(token);
  const [update, setUpdate] = useState(false);
  const [merit, setMerit] = useState();
  const [email, setEmail] = useState();
  const [open, setOpen] = useState(false);
  const TABLE_HEAD = [
    "Name",
    "Email",
    "Matric Number",
    "Merit",
    "Registration Date",
    "Role",
    "Action",
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

  // Handle new merit input
  function handleNewMerit(event) {
    setMerit(event.target.value);
  }

  // Fetch all UserList lists
  async function fetchAllList() {
    const { data } = await supabase
      .from("userlist")
      .select("*")
      .order("created_at", { ascending: true });
    setTotalUserList(data);
  }

  async function submitMerit() {
    let { data, error } = await supabase.rpc("update_user_merit_by_email", {
      merit: merit,
      user_email: email,
    });
    if (error) console.error(error);
    else {
      setEmail(null);
      setMerit(null);
      setOpen(false);
      window.location.reload();
    }
  }

  async function modifyRole(email, role) {
    let { data, error } = await supabase.rpc("update_user_role", {
      user_email: email,
      user_role: role,
    });
    if (error) console.error(error);
    else {
      window.location.reload();
    }
  }

  // Initial data fetching on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/");
      }

      try {
        roleSet();
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

  return (
    <>
      {open ? (
        <div
          className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-md overflow-auto py-8 px-10 w-[600px]">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <p className="font-semibold text-3xl text-center pt-1">
                Please fill in new merit marks for this user
              </p>

              <div className="mb-4">
                <input
                  type="number"
                  min={0}
                  className="border px-4 py-2"
                  onChange={handleNewMerit}
                />
              </div>

              <button
                onClick={() => {
                  submitMerit();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md py-2 px-4 w-full text-center"
              >
                Update Merit
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
      {/* Conditionally renders the components based on user role */}
      {role === "advisor" ? (
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
              {totalUserList.map(
                (
                  {
                    id,
                    fullName,
                    email,
                    matricNumber,
                    merit_marks,
                    created_at,
                    role,
                  },
                  index
                ) => {
                  const isLast = index === totalUserList.length - 1;
                  const classes = isLast
                    ? "p-4 border-b"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <p className="font-normal">{fullName}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{email}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{matricNumber}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">{merit_marks}</p>
                      </td>
                      <td className={classes}>
                        <p className="font-normal">
                          {convertDateFormat(created_at)}
                        </p>
                      </td>
                      <td className={classes}>
                        Current role: {role}
                        <div className="flex flex-col items-start gap-1 py-4">
                          <button
                            className="text-sm text-white bg-purple-600 px-2 py-1 rounded hover:bg-purple-700"
                            onClick={() => {
                              modifyRole(email, "advisor");
                            }}
                          >
                            Set As Advisor
                          </button>
                          <button
                            className="text-sm text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                            onClick={() => {
                              modifyRole(email, "admin");
                            }}
                          >
                            Set As Admin
                          </button>
                          <button
                            className="text-sm text-white bg-orange-400 px-2 py-1 rounded hover:bg-orange-500"
                            onClick={() => {
                              modifyRole(email, "member");
                            }}
                          >
                            Set As Member
                          </button>
                        </div>
                      </td>

                      <td className={classes}>
                        <button
                          onClick={() => {
                            setOpen(true);
                            setEmail(email);
                          }}
                          className="text-purple-600 underline text-sm font-bold hover:text-purple-900"
                        >
                          Edit Merit
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default UserList;
