import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ManageGallery = () => {
  const [document, setDocument] = useState();
  const [documentValidator, setDocumentValidator] = useState(false);
  const [totalGalleryList, setTotalGalleryList] = useState([]);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState();
  const token = sessionStorage.getItem("token");
  let obj = JSON.parse(token);
  const [update, setUpdate] = useState(false);
  const [link, setLink] = useState("");

  let navigate = useNavigate();

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
    const { data } = await supabase.from("gallery").select("*");
    setTotalGalleryList(data);
  }

  // Initial data fetching on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/");
      }
      fetchAllList();
      try {
        roleSet();
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, [token, navigate, update]);

  // Submit ManageGallery form
  async function submitManageGalleryForm() {
    if (documentValidator) {
      const { error, data } = await supabase
        .from("gallery")
        .insert({})
        .select();
      const { res } = await supabase.storage
        .from("gallery")
        .upload(data[0].id, document);
    }

    // Update the state to trigger a re-render
    setUpdate((prevUpdate) => !prevUpdate);

    setOpen(false);
  }

  async function deleteAd(file, id) {
    const { data, error } = await supabase.storage
      .from("gallery")
      .remove([file]);

    if (data) {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      fetchAllList();
    }
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
        {/* ManageGallery create modal */}
        {open ? (
          <div
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="bg-white rounded-md overflow-auto py-8 px-10 w-[600px]">
              <div className="w-full flex flex-col items-center justify-center gap-4">
                <p className="font-semibold text-3xl text-center pt-1">
                  Upload new gallery picture (Make sure image is 600px x 700px)
                  and in PNG format
                </p>

                <div className="mb-4 w-full flex flex-col items-center">
                  <label className="block text-gray-600 text-center">
                    Image
                  </label>
                  <input
                    type="file"
                    id="documents"
                    name="documents"
                    className="py-2"
                    accept="image/png"
                    onChange={handleDocument}
                  />
                </div>
                <button
                  onClick={() => {
                    submitManageGalleryForm();
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
            Add gallery
          </button>
        </div>
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <p className="font-normal leading-none opacity-70">Image</p>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <p className="font-normal leading-none opacity-70">
                  Created At
                </p>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <p className="font-normal leading-none opacity-70">Action</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {totalGalleryList.map(({ id, created_at }, index) => {
              const isLast = index === totalGalleryList.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={id}>
                  <td className={classes}>
                    <div className="w-40 h-40">
                      <img
                        src={
                          "https://hvzzpfhyghxvhtfvtivo.supabase.co/storage/v1/object/public/gallery/" +
                          id
                        }
                        alt="document"
                      />
                    </div>
                  </td>
                  <td className={classes}>
                    <p className="font-normal">
                      {convertDateFormat(created_at)}
                    </p>
                  </td>

                  <td className={classes}>
                    <button
                      onClick={() => {
                        deleteAd(id + ".png", id);
                      }}
                      className="text-white text-md font-semibold bg-red-600 hover:bg-red-700 rounded-md px-4 py-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageGallery;
