import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Events = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [document, setDocument] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [documentValidator, setDocumentValidator] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState();
  const [userEventsList, setUserEventsList] = useState([]);
  const [totalEventsList, setTotalEventsList] = useState([]);
  const token = sessionStorage.getItem("token");
  let obj = JSON.parse(token);
  const [update, setUpdate] = useState(false);
  const today = new Date().toLocaleDateString("sv-SE");
  const TABLE_HEAD = [
    "Author Name",
    "Email",
    "Matric Number",
    "Title",
    "Description",
    "Document",
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

  function handleStartDate(event) {
    setStartDate(event.target.value);
  }

  function handleEndDate(event) {
    setEndDate(event.target.value);
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

  // Fetch all Events lists
  async function fetchAllList() {
    const { data } = await supabase.from("events").select("*");
    setTotalEventsList(data);
  }

  // Initial data fetching on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/");
      }

      try {
        roleSet();
        const { data } = await supabase.from("events").select("*");

        setUserEventsList(data);
        fetchAllList();
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, [token, navigate, update]);

  // Submit Events form
  async function submitEventsForm() {
    const { error, data } = await supabase
      .from("events")
      .insert({
        author_email: obj.user.email,
        event_date:
          startDate === endDate ? startDate : startDate + " to " + endDate,
        title: title,
        description: content,
        document: documentValidator,
      })
      .select();

    if (documentValidator) {
      const { res } = await supabase.storage
        .from("events")
        .upload(
          obj.user.email + "eventsdocument" + data[0].created_at,
          document
        );
    }

    // Update the state to trigger a re-render
    setUpdate((prevUpdate) => !prevUpdate);

    window.location.reload();

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

  return (
    <>
      <Navbar />
      {/* Conditionally renders the components based on user role */}

      <div
        className={
          role === "admin" || role === "advisor"
            ? "grid grid-cols-2 h-screen"
            : "h-screen"
        }
      >
        <div className={"col-span-1 w-full h-full bg-orange-400"}>
          <div className="p-6">
            <h1 className="text-white font-semibold text-2xl">My Events</h1>
          </div>
          <div className="h-[600px] overflow-y-auto">
            {userEventsList.length !== 0 ? (
              userEventsList?.map((x) => (
                <div className="rounded-md bg-white mx-4 my-3">
                  <div className="flex justify-between items-center border-b py-2 px-4">
                    <h3 className="font-semibold text-xl"> {x.title}</h3>
                    <p className="text-slate-400 text-md">{x.event_date}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="col-span-1 flex justify-center items-center border-r">
                      {x.document ? (
                        <img
                          src={
                            "https://hvzzpfhyghxvhtfvtivo.supabase.co/storage/v1/object/public/events/" +
                            x.author_email +
                            "eventsdocument" +
                            x.created_at
                          }
                          alt="document"
                          className="w-[300px]"
                        />
                      ) : (
                        <div className="text-purple-600 text-3xl font-semibold w-[300px] h-[300px] flex justify-center items-center ">
                          No docs
                        </div>
                      )}
                    </div>
                    <div className="col-span-1 px-4 py-2">{x.description}</div>
                  </div>
                  <div className="flex justify-end items-center text-xs text-slate-500 border-t py-2 px-4">
                    created on: {convertDateFormat(x.created_at)} by{" "}
                    {x.author_email}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-white">No Events</div>
            )}
          </div>
        </div>

        {role === "admin" || role === "advisor" ? (
          <div className="col-span-1 mt-10 my-6 mx-6">
            <h1 className="text-2xl font-semibold mb-4">Create Events</h1>

            <div className="mb-4">
              <label className="block text-gray-600">Event Title</label>
              <input
                type="text"
                id="matricNo"
                name="matricNo"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                onChange={handleTitle}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">Event Description</label>
              <textarea
                type="text"
                id="matricNo"
                name="matricNo"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                onChange={handleContent}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">Event Start Date</label>
              <input
                type="date"
                id="matricNo"
                name="matricNo"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                onChange={handleStartDate}
                min={today}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">Event End Date</label>
              <input
                type="date"
                id="matricNo"
                name="matricNo"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                onChange={handleEndDate}
                min={startDate}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">Event Attachment</label>
              <input
                type="file"
                id="documents"
                name="documents"
                className="py-2"
                onChange={handleDocument}
              />
            </div>

            <button
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-md py-2 px-4 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
              onClick={() => submitEventsForm()}
            >
              Submit Event
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Events;
