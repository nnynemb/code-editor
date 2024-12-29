import React, { useState } from 'react';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase-config';
import './Login.scss'; // Assuming you have a separate CSS file for styling
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);
            setUser(user);  // Store the logged-in user
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    const handleGithubLogin = async () => {
        const provider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);
            setUser(user);  // Store the logged-in user
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            console.log(user);
            setUser(user);  // Store the logged-in user
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {user ? (
                <div className="user-info">
                    <p>Welcome, {user.displayName}</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <div className="login-form">
                    {error && <p className="error">{error}</p>}
                    <div className="social-login-buttons">
                        <button onClick={handleGoogleLogin} className="social-btn google-btn">Login with Google</button>
                        <button onClick={handleGithubLogin} className="social-btn github-btn">Login with GitHub</button>
                    </div>
                    <hr />
                    <div className="email-login">
                        <form onSubmit={handleEmailLogin}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="login-btn">Login with Email</button>
                        </form>
                        <p>
                            Don't have an account?{' '}
                            <button className="signup-btn" onClick={() => navigate('/signup')}>
                                Signup here
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
