import React from "react";
import { useAuth } from "../contexts/authContext/Index";

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div>
            <p>hi</p>
        </div>
    )
}

export default Home