import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Home = () => {
  let navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [totalForumList, setTotalForumList] = useState([]);
  const [totalEventsList, setTotalEventsList] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    fetchAllForumList();
    fetchAllEventsList();
  }, [token, navigate]);

  async function fetchAllForumList() {
    const { data } = await supabase.from("forums").select("*");
    setTotalForumList(data);
  }

  async function fetchAllEventsList() {
    const { data } = await supabase.from("events").select("*");
    setTotalEventsList(data);
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
      <div className="grid grid-cols-2">
        <div className="col-span-1 bg-purple-600">
          <h3 className="text-center py-2 font-semibold text-xl text-white">
            Forums
          </h3>
          <div className="w-full flex flex-col gap-4 max-h-[720px] overflow-y-auto">
            {totalForumList.length > 0 ? (
              totalForumList.map(
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
                  return (
                    <div>
                      <div
                        className="rounded-md mx-4 my-3 border bg-white"
                        key={created_at}
                      >
                        <div className="flex justify-between items-center border-b py-2 px-4">
                          <h3 className="font-semibold text-xl">
                            {title} by {author_name}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2">
                          <div className="col-span-1 flex justify-center items-center border-r">
                            {document ? (
                              <img
                                src={
                                  "https://hvzzpfhyghxvhtfvtivo.supabase.co/storage/v1/object/public/forum/" +
                                  author_name +
                                  "forumdocument" +
                                  created_at
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
                          <div className="col-span-1 px-4 py-2">
                            {description}
                          </div>
                        </div>
                        <div className="flex justify-end items-center text-xs text-slate-500 border-t py-2 px-4">
                          created {convertDateFormat(created_at)} by{" "}
                          {author_email}
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="text-center">
                No new forums/announcements created yet!
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 bg-orange-400">
          <h3 className="text-center py-2 font-semibold text-xl text-white">
            Events
          </h3>
          <div className="w-full flex flex-col gap-4 max-h-[720px] overflow-y-auto">
            {totalEventsList.length !== 0 ? (
              totalEventsList?.map((x) => (
                <div className="rounded-md border mx-4 my-3 bg-white">
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
              <div className="text-center text-white">
                No Events created yet!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
