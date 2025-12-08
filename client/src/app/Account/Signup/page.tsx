/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import * as client from "../client";
import Link from "next/link";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await client.signup({ username, email, password });
      dispatch(setCurrentUser(user));
      router.push("/Home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div
        className="groove-card p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center text-white mb-4">Join Groove</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label text-cream">Username</label>
            <input
              type="text"
              className="form-control bg-purple-dark text-white border-0"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-cream">Email</label>
            <input
              type="email"
              className="form-control bg-purple-dark text-white border-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-cream">Password</label>
            <input
              type="password"
              className="form-control bg-purple-dark text-white border-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-cream w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-cream mb-0">
            Already have an account?{" "}
            <Link href="/Account/Signin" className="text-orange">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
