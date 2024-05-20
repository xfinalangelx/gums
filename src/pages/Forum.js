import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Forum = () => {
  const [fullName, setFullName] = useState("");
  const [document, setDocument] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [documentValidator, setDocumentValidator] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState();
  const [userForumList, setUserForumList] = useState([]);
  const [totalForumList, setTotalForumList] = useState([]);
  const token = sessionStorage.getItem("token");
  let obj = JSON.parse(token);
  const [update, setUpdate] = useState(false);
  const TABLE_HEAD = [
    "Author Name",
    "Email",
    "Title",
    "Description",
    "Document",
    "Created At",
    "Action",
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

  // Fetch all Forum lists
  async function fetchAllList() {
    const { data } = await supabase.from("forums").select("*");
    setTotalForumList(data);
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
          .from("forums")
          .select("*")
          .eq("author_email", obj.user.email);

        setUserForumList(data);
        fetchAllList();
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, [token, navigate, update]);

  // Submit Forum form
  async function submitForumForm() {
    const { error, data } = await supabase
      .from("forums")
      .insert({
        author_email: obj.user.email,
        author_name: fullName,
        title: title,
        description: content,
        document: documentValidator,
      })
      .select();

    if (documentValidator) {
      const { res } = await supabase.storage
        .from("forum")
        .upload(fullName + "forumdocument" + data[0].created_at, document);
    }

    // Update the state to trigger a re-render
    setUpdate((prevUpdate) => !prevUpdate);

    setOpen(false);
  }

  async function deleteForum(id) {
    const { error, data } = await supabase
      .from("forums")
      .delete()
      .eq("id", id)
      .select();
    window.location.reload();
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

  return (
    <>
      <Navbar />
      {/* Conditionally renders the components based on user role */}
      <div>
        {/* Forum create modal */}
        {open ? (
          <div
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white rounded-md overflow-auto py-8 px-10 w-[600px]">
              <div className="w-full flex flex-col items-center justify-center gap-4">
                <p className="font-semibold text-3xl text-center pt-1">
                  Create New Forum
                </p>

                <div className="mb-4 w-full">
                  <label className="block text-gray-600 text-center">
                    Author Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    onChange={handleFullName}
                  />
                </div>

                <div className="mb-4 w-full">
                  <label className="block text-gray-600 text-center">
                    Forum Title
                  </label>
                  <input
                    type="text"
                    id="matricNo"
                    name="matricNo"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    onChange={handleTitle}
                  />
                </div>

                <div className="mb-4 w-full">
                  <label className="block text-gray-600 text-center">
                    Forum Content
                  </label>
                  <textarea
                    type="text"
                    id="matricNo"
                    name="matricNo"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    onChange={handleContent}
                  />
                </div>

                <div className="mb-4 w-full flex flex-col items-center">
                  <label className="block text-gray-600 text-center">
                    Forum Attachment
                  </label>
                  <input
                    type="file"
                    id="documents"
                    name="documents"
                    className="py-2"
                    onChange={handleDocument}
                  />
                </div>
                <button
                  onClick={() => {
                    submitForumForm();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-2 px-4 w-full text-center"
                >
                  Confirm
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
        <div className="flex justify-end items-center p-4">
          <button
            onClick={() => setOpen(true)}
            className="py-2 px-4 rounded-md bg-green-600 text-white flex justify-center items-center hover:bg-green-700"
          >
            Add Forum
          </button>
        </div>
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
            {totalForumList.map(
              (
                {
                  id,
                  author_email,
                  author_name,
                  title,
                  description,
                  document,
                  created_at,
                },
                index
              ) => {
                const isLast = index === totalForumList.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={created_at}>
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
                            "https://hvzzpfhyghxvhtfvtivo.supabase.co/storage/v1/object/public/forum/" +
                            author_name +
                            "forumdocument" +
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
                      <p className="font-normal">
                        {convertDateFormat(created_at)}
                      </p>
                    </td>
                    <td className={classes}>
                      <button
                        onClick={() => deleteForum(id)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded py-2 px-4"
                      >
                        Delete
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

export default Forum;
