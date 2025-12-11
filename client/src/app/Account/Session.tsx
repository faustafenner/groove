/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as client from "./client"; //import client-side account API functions
import { useEffect, useState } from "react"; //import React hooks
import { setCurrentUser } from "./reducer"; //import Redux action to set current user
import { useDispatch } from "react-redux"; //import Redux dispatch hook

export default function Session({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  //checks for an active user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = await client.profile();
        dispatch(setCurrentUser(currentUser));
      } catch (err: any) {
        // Not logged in, that's okay
        console.log("No active session");
      } finally {
        setPending(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  //show loading spinner while checking for active session
  if (pending) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#33142F",
        }}
      >
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  //render children components once session check is complete
  return <>{children}</>;
}
