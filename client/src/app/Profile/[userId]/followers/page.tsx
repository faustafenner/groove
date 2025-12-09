/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function FollowersPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<any>(null);
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, followersRes] = await Promise.all([
          axios.get(`${HTTP_SERVER}/api/users/${userId}`),
          axios.get(`${HTTP_SERVER}/api/users/${userId}/followers`),
        ]);

        setUser(userRes.data);
        setFollowers(followersRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
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
      <div className="mb-4">
        <Link
          href={`/Profile/${userId}`}
          className="text-orange text-decoration-none"
        >
          ← Back to {user.username}&apos;s profile
        </Link>
      </div>

      <h2 className="text-white mb-4">{user.username}&apos;s Followers</h2>

      {followers.length > 0 ? (
        <div className="row g-3">
          {followers.map((follower) => (
            <div key={follower._id} className="col-12 col-md-6 col-lg-4">
              <Link
                href={`/Profile/${follower._id}`}
                className="text-decoration-none"
              >
                <div className="groove-card p-3 d-flex align-items-center gap-3">
                  {/* Avatar */}
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "#4a2045",
                      flexShrink: 0,
                    }}
                  >
                    {follower.avatar ? (
                      <Image
                        src={follower.avatar}
                        alt={follower.username}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#D76A05",
                        }}
                      >
                        {follower.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <h6 className="text-white mb-0">{follower.username}</h6>
                    {follower.bio && (
                      <p
                        className="text-cream small mb-0"
                        style={{ opacity: 0.7 }}
                      >
                        {follower.bio.substring(0, 50)}
                        {follower.bio.length > 50 ? "..." : ""}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="groove-card p-4 text-center">
          <p className="text-cream mb-0">No followers yet</p>
        </div>
      )}
    </div>
  );
}
