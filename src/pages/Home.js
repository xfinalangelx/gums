import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Home = () => {
  let navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [totalForumList, setTotalForumList] = useState([]);
  const [totalEventsList, setTotalEventsList] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  let obj = JSON.parse(token);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    fetchAllForumList();
    fetchAllComments();
    console.log(comments);
  }, [token, navigate]);

  async function fetchAllForumList() {
    const { data } = await supabase.from("forums").select("*");
    setTotalForumList(data);
  }

  async function fetchAllComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    setComments(data);
  }

  function fetchComments(id) {
    const commentGroup = comments.filter((item) => item.forum_id.includes(id));
    console.log(commentGroup);
    return commentGroup?.map((x) => (
      <div className="flex flex-col gap-1 bg-green-50 p-2 rounded-md">
        <p className="text-black font-semibold">{x.email}</p>
        <p className="text-slate-800 text-sm">{x.comment}</p>
        <p className="text-right text-sm text-slate-400">
          {convertDateFormat(x.created_at)}
        </p>
      </div>
    ));
  }

  async function submitComment(id) {
    const { data } = await supabase
      .from("comments")
      .insert({ email: obj.user.email, comment: comment, forum_id: id })
      .select();
    window.location.reload();
  }

  function handleComment(event) {
    setComment(event.target.value);
  }

  function validator() {
    return comment.length < 1;
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
        <div className="col-span-full">
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
                          <div className="flex justify-end items-center text-xs text-slate-500 py-2 px-4">
                            created {convertDateFormat(created_at)} by{" "}
                            {author_email}
                          </div>
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
                              <div className="text-green-600 text-3xl font-semibold w-[300px] h-[300px] flex justify-center items-center ">
                                No docs
                              </div>
                            )}
                          </div>
                          <div className="col-span-1 px-4 py-2">
                            {description}
                          </div>
                        </div>
                        <div className="border-t py-3 px-4 flex items-center gap-2">
                          <input
                            onChange={handleComment}
                            type="text"
                            className="w-full border border-gray-600 rounded p-1"
                          />
                          <button
                            disabled={validator()}
                            onClick={() => {
                              submitComment(id);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Comment
                          </button>
                        </div>
                        <div className="h-[300px] overflow-y-auto flex flex-col gap-3 px-4 py-2">
                          {fetchComments(id)}
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
      </div>
    </>
  );
};

export default Home;
