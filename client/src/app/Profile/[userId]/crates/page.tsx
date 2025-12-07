/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FaCrown } from "react-icons/fa";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function UserCratesPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<any>(null);
  const [crates, setCrates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isProUser = user && (user.role === "PRO" || user.role === "ADMIN");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, cratesRes] = await Promise.all([
          axios.get(`${HTTP_SERVER}/api/users/${userId}`),
          axios.get(`${HTTP_SERVER}/api/crates/user/${userId}`),
        ]);

        setUser(userRes.data);
        setCrates(cratesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-5 text-cream">User not found</div>;
  }

  return (
    <div>
      {/* Header with User Info */}
      <Link href={`/Profile/${userId}`} className="text-decoration-none">
        <div className="d-flex align-items-center gap-3 mb-4">
          {/* User Avatar */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#4a2045",
              flexShrink: 0,
            }}
          >
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                width={50}
                height={50}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#D76A05",
                }}
              >
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Username with Crown */}
          <div className="d-flex align-items-center gap-2">
            {isProUser && <FaCrown size={20} style={{ color: "#F5A623" }} />}
            <h5 className="text-white mb-0">{user.username}&apos;s crates</h5>
          </div>
        </div>
      </Link>

      {/* Crates Grid */}
      {crates.length > 0 ? (
        <div className="row g-3">
          {crates.map((crate) => (
            <div key={crate._id} className="col-4">
              <Link
                href={`/Crates/${crate._id}`}
                className="text-decoration-none"
              >
                <div
                  style={{
                    // borderRadius: "8px",
                    // padding: "10px",
                    aspectRatio: "1/1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Crate Image/Vinyl */}
                  <div
                    style={{
                      width: "90%",
                      aspectRatio: "1/1",
                      position: "relative",
                    }}
                  >
                    <Image
                      src="/crate.png"
                      alt={crate.title}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
                <h3
                  className="text-white text-center"
                  //   style={{ fontSize: "0.9rem" }}
                >
                  {crate.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="text-cream">No crates yet</p>
        </div>
      )}
    </div>
  );
}
