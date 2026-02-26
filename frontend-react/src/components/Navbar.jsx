import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <span className="nav-logo">✦</span>
                <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>TaskFlow</Link>
            </div>

            <div className="nav-user">
                {user ? (
                    <>
                        <span>Hello, {user.name}</span>
                        <button className="btn btn-sm-danger" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <span>Welcome!</span>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
