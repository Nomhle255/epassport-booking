import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "../styles/SignIn.css";

export default function SignIn({ onSignInSuccess, onSwitchToSignUp, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      onSignInSuccess();
    } catch (err) {
      let errorMessage = "Failed to sign in";
      
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-header">
          <h1>Admin Sign In</h1>
          <p>Access the ePassport Booking Admin Dashboard</p>
        </div>

        <form onSubmit={handleSignIn} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="signin-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="signin-divider">
          <span>OR</span>
        </div>

        <div className="signin-footer">
          <p>Don't have an admin account?</p>
          <button
            className="switch-button"
            onClick={onSwitchToSignUp}
            disabled={loading}
          >
            Create Admin Account
          </button>
        </div>

        <button
          className="back-button"
          onClick={onBack}
          disabled={loading}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

