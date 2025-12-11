/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import * as client from "../client";
import Link from "next/link";

export default function SigninPage() {
  const [email, setEmail] = useState(""); //state for email input
  const [password, setPassword] = useState(""); //state for password input
  const [error, setError] = useState(""); //state for error messages
  const [loading, setLoading] = useState(false); //state for loading indicator
  const router = useRouter(); //Next.js router for navigation
  const dispatch = useDispatch(); //Redux dispatch function

  //handle form submission for signing in
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault(); //stops page reload on form submit
    setError(""); //clear previous errors
    setLoading(true); //set loading state

    //attempt to sign in user
    try {
      const user = await client.signin({ email, password }); //call signin API from client
      dispatch(setCurrentUser(user)); //update Redux store with current user
      router.push("/Home"); //navigate to home page upon successful signin

      //return error message if signin fails
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
    setLoading(false); //reset loading state
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div
        className="groove-card p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center text-white mb-4">Sign In</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSignin}>
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
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-cream w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-cream mb-0">
            Don&apos;t have an account?{" "}
            <Link href="/Account/Signup" className="text-orange">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
