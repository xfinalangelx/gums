import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });
  return (
    <>
      <Navbar />
      <div className="h-screen w-full flex justify-center items-center">
        Under construction
      </div>
    </>
  );
};

export default Home;
