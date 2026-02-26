import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return setError("Please fill all fields");

        setLoading(true);
        setError(null);
        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.user, res.data.token);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card auth-card">
            <h2>Welcome Back</h2>
            <p>Log in to manage your tasks</p>

            <form onSubmit={handleSubmit}>
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
                        placeholder="••••••••"
                    />
                </div>

                {error && <div className="error-text">{error}</div>}

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "16px" }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: "24px", fontSize: "0.9rem" }}>
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
