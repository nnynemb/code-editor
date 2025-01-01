import React from "react";
import { auth, provider, signInWithPopup } from "./../../services/firebase.js";
import "./Login.scss"; // Import the CSS file for styling

const Login = () => {
    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome!</h1>
                <p>Sign in with your Google account to continue.</p>
                <button className="login-button" onClick={handleLogin}>
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
