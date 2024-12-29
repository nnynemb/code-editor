import React, { useState } from 'react';
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    fetchSignInMethodsForEmail,
    linkWithCredential,
} from 'firebase/auth';
import { auth } from '../../services/firebase-config';
import './Login.scss'; // Assuming you have a separate CSS file for styling
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('Please login using your Google or GitHub account.');
    const navigate = useNavigate();

    const handleSocialLogin = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const loggedInUser = result.user;
            console.log(loggedInUser);
            setUser(loggedInUser);
            // navigate('/dashboard'); // Redirect after successful login
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                const existingEmail = error.customData.email; // Email causing the conflict
                const pendingCredential = error.credential; // The credential to link
                
                try {
                    // Fetch the sign-in methods for the email
                    const signInMethods = await fetchSignInMethodsForEmail(auth, existingEmail);

                    // Handle linking the accounts
                    console.log('Sign-in methods:', signInMethods);

                    if (signInMethods.includes('google.com')) {
                        const googleProvider = new GoogleAuthProvider();
                        const googleResult = await signInWithPopup(auth, googleProvider);

                        // Link the pending credential to the signed-in user
                        await linkWithCredential(googleResult.user, pendingCredential);
                        setUser(googleResult.user);
                        // navigate('/dashboard'); // Redirect after linking
                    } else if (signInMethods.includes('github.com')) {
                        const githubProvider = new GithubAuthProvider();
                        const githubResult = await signInWithPopup(auth, githubProvider);

                        // Link the pending credential to the signed-in user
                        await linkWithCredential(githubResult.user, pendingCredential);
                        setUser(githubResult.user);
                        // navigate('/dashboard'); // Redirect after linking
                    } else {
                        setError('Please sign in using the provider associated with your email.');
                    }
                } catch (linkError) {
                    console.error('Error linking accounts:', linkError);
                    setError(linkError.message);
                }
            } else {
                console.error('Login error:', error);
                setError(error.message);
            }
        }
    };

    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();
        handleSocialLogin(provider);
    };

    const handleGithubLogin = () => {
        const provider = new GithubAuthProvider();
        handleSocialLogin(provider);
    };

    return (
        <div className="login-container">
            <h1>nnynemb.com</h1>
            {user ? (
                <div className="user-info">
                    <p>Welcome, {user.displayName || 'User'}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={() => auth.signOut().then(() => setUser(null))}>
                        Logout
                    </button>
                </div>
            ) : (
                <div className="login-form">
                    {error && <p className="error">{error}</p>}
                    <div className="social-login-buttons">
                        <button onClick={handleGoogleLogin} className="social-btn google-btn">
                            Login with Google
                        </button>
                        <button onClick={handleGithubLogin} className="social-btn github-btn">
                            Login with GitHub
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
