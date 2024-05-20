import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const RegistrationList = () => {
  const [userList, setUserList] = useState([]);
  const [userUpdate, setUserUpdate] = useState(false);

  let navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      // Redirect to login if there is no token
      navigate("/");
    } else {
      async function fetchRegistrationForms() {
        try {
          const { data, error } = await supabase.from("registration").select();
          if (error) {
            throw error;
          }
          setUserList(data || []); // Set to empty array if data is falsy
          setUserUpdate(false);
        } catch (error) {
          console.error("Error fetching registration forms:", error.message);
        }
      }
      fetchRegistrationForms();
    }
  }, [token, navigate, userUpdate]);

  const TABLE_HEAD = [
    "Full Name",
    "Email",
    "Matric Number",
    "Role",
    "Document",
    "Action",
  ];

  // Function to approve a user and handle related actions
  const approveUser = async (id, fullName, email, matricNumber, role) => {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: matricNumber,
        fullName: fullName,
        role: role,
        matricNumber: matricNumber,
      });

      // Insert user details into the userlist table
      const {} = await supabase
        .from("userlist")
        .insert({
          email: email,
          fullName: fullName,
          matricNumber: matricNumber,
          role: role,
        })
        .select();

      // Delete the approved registration form
      const {} = await supabase.from("registration").delete().eq("id", id);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error approving user:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <p className="font-normal leading-none opacity-70">{head}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {userList.map(
              ({ id, email, fullName, matricNumber, role }, index) => {
                const isLast = index === userList.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={fullName}>
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
                      <p className="font-normal">{role}</p>
                    </td>
                    <td className={classes}>
                      <img
                        src={`https://hvzzpfhyghxvhtfvtivo.supabase.co/storage/v1/object/public/documents/${matricNumber}document`}
                        alt="document"
                        className="w-20 h-20"
                      />
                    </td>
                    <td className={classes}>
                      <button
                        onClick={() => {
                          approveUser(id, fullName, email, matricNumber, role);
                        }}
                        className="text-white text-md font-semibold bg-green-600 hover:bg-green-700 rounded-md px-4 py-2"
                      >
                        Approve
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

export default RegistrationList;
