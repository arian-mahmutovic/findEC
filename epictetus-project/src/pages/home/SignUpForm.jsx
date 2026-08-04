import './SignUpForm.css';
import { useState } from 'react';
export default function SignUpForm({ closeForm }) {

    const showLogInForm = () => {
        closeForm();
    };

    const signUpNewUser = () => {
        console.log('new signup!')
    };

    function handleSubmit(e) {
        e.preventDefault();
        // signup logic here
    };

    return (
        <div className="signup-overlay">

            <div className="signup-modal">

                <button className="close-button" onClick={closeForm}>
                    ✕
                </button>

                <h2>Create your account</h2>

                <p>
                    Save competitions, receive personalized recommendations,
                    and unlock the full database.
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Full Name"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                    />


                    <input
                        type="password"
                        placeholder="Password"
                    />

                    <button type="submit" className="signup-button" onClick={signUpNewUser}>
                        Create Account
                    </button>

                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <button className="google-button">
                    Continue with Google
                </button>

                <p className="login-link">
                    Already have an account?
                    <button onClick={showLogInForm}>
                        Log in
                    </button>
                </p>

            </div>

        </div>
    );
}