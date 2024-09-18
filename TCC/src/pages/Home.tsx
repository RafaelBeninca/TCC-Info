import React from "react";
import { useAuth } from "../contexts/authContext";
import { Outlet } from "react-router-dom";
import "flowbite";

const Home = () => {
  const { currentUser } = useAuth();
  return (
    <div>
      <p>Home</p>
    </div>
  );
};

export default Home;
