import React from "react";
import { useAuth } from "../contexts/authContext/Index";
import { Outlet } from "react-router-dom";

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div>
            <p>home</p>
            <Outlet/>
        </div>
    )
}

export default Home