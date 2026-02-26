import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) return setError("Please fill all fields");
        if (password.length < 6) return setError("Password must be at least 6 characters");

        setLoading(true);
        setError(null);
        try {
            await api.post("/auth/register", { name, email, password });
            // On success, redirect to login
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card auth-card">
            <h2>Create Account</h2>
            <p>Join TaskFlow in seconds</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        className="input-base"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        className="input-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@codveda.com"
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="input-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                    />
                </div>

                {error && <div className="error-text">{error}</div>}

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "16px" }}>
                    {loading ? "Creating account..." : "Register"}
                </button>
            </form>

            <p style={{ marginTop: "24px", fontSize: "0.9rem" }}>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
};

export default Register;
