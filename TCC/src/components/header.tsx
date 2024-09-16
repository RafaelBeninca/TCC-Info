import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext/Index";
import { doSignOut } from "../contexts/authContext/Auth";

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <nav className="">
            <h1>Teste</h1>
            <Outlet/>
        </nav>
    )
}

export default Header;