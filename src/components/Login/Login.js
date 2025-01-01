import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, provider, signInWithPopup } from "./../../services/firebase.js";
import "./Login.scss";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from the location state or default to the home page
    const redirectPath = location.state?.from?.pathname || "/";
    const sessionId = redirectPath?.split("/")?.pop();

    const handleLogin = async () => {
        setLoading(true);
        setError(""); // Clear any previous errors
        try {
            await signInWithPopup(auth, provider);
            // Redirect to the previous page or home page
            navigate(redirectPath, { replace: true });
        } catch (error) {
            console.error("Error during login:", error);
            setError("Failed to log in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome!</h1>
                <p>Sign in with your Google account to continue.</p>
                {sessionId && <p>Session ID: {sessionId}</p>}
                {error && <p className="error-message">{error}</p>}
                <button
                    className="login-button"
                    onClick={handleLogin}
                    disabled={loading}
                    aria-label="Login with Google"
                >
                    {loading ? "Logging in..." : "Login with Google"}
                </button>
            </div>
        </div>
    );
};

export default Login;
