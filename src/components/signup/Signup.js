import React, { useState } from 'react';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase-config';
import './Signup.scss';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setIsLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);
            setUser(user);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleGithubSignUp = async () => {
        const provider = new GithubAuthProvider();
        try {
            setIsLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);
            setUser(user);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        try {
            setIsLoading(true);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            console.log(user);
            setUser(user);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Create Account</h2>
            {user ? (
                <div className="user-info">
                    <p>Welcome, {user.displayName}</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <div className="signup-form">
                    {error && <p className="error">{error}</p>}

                    {/* Social sign-up buttons */}
                    <div className="social-signup-buttons">
                        <button
                            onClick={handleGoogleSignUp}
                            className="social-btn google-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing up with Google...' : 'Sign up with Google'}
                        </button>
                        <button
                            onClick={handleGithubSignUp}
                            className="social-btn github-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing up with GitHub...' : 'Sign up with GitHub'}
                        </button>
                    </div>

                    <hr />

                    {/* Email and password form */}
                    <div className="email-signup">
                        <form onSubmit={handleEmailSignUp}>
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
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="signup-btn" disabled={isLoading}>
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>

                    <p>
                        Already have an account?{' '}
                        <button className="login-btn" onClick={() => navigate('/login')}>
                            Login here
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SignUp;
