/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Image from "next/image";
import Link from "next/link";
import ReviewCard from "@/components/ReviewCard";
import axios from "axios";
import { FaCrown } from "react-icons/fa";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [crates, setCrates] = useState<any[]>([]);
  const [followCounts, setFollowCounts] = useState({
    followers: 0,
    following: 0,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        const [userRes, reviewsRes, cratesRes, countsRes] = await Promise.all([
          axios.get(`${HTTP_SERVER}/api/users/${userId}`),
          axios.get(`${HTTP_SERVER}/api/reviews/user/${userId}`),
          axios.get(`${HTTP_SERVER}/api/crates/user/${userId}`),
          axios.get(`${HTTP_SERVER}/api/users/${userId}/follow-counts`),
        ]);

        if (isMounted) {
          setUser(userRes.data);
          setReviews(reviewsRes.data);
          setCrates(cratesRes.data);
          setFollowCounts(countsRes.data);
        }

        if (currentUser && isMounted) {
          const followRes = await axiosWithCredentials.get(
            `${HTTP_SERVER}/api/users/${userId}/is-following`
          );
          setIsFollowing(followRes.data.isFollowing);
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [userId, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      if (isFollowing) {
        await axiosWithCredentials.delete(
          `${HTTP_SERVER}/api/users/${userId}/follow`
        );
        setIsFollowing(false);
        setFollowCounts((prev) => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await axiosWithCredentials.post(
          `${HTTP_SERVER}/api/users/${userId}/follow`
        );
        setIsFollowing(true);
        setFollowCounts((prev) => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isOwnProfile = currentUser && currentUser._id === userId;
  const isProUser = user && (user.role === "PRO" || user.role === "ADMIN");

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
    <div
      style={{
        backgroundImage: "url(/frequency2.png)",
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        minHeight: "100vh",
      }}
    >
      {/* Profile Header */}
      <div
        className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-5 mb-6"
        style={{ paddingTop: "80px" }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 300,
            height: 300,
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
              width={300}
              height={300}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="w-100 h-100 d-flex align-items-center justify-content-center"
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "#D76A05",
              }}
            >
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="text-center text-md-start">
          {/* Username with Crown for PRO */}
          <div
            className="d-flex align-items-center justify-content-center justify-content-md-start mb-2"
            style={{ gap: "15px" }}
          >
            {isProUser && (
              <FaCrown
                size={36}
                style={{
                  color: "#D76A05",
                  transform: "rotate(-15deg)",
                }}
              />
            )}
            <h1 className="text-white mb-0">{user.username}</h1>
          </div>

          {/* Stats */}
          <h3 className="text-cream mb-2">
            {reviews.length} reviews | {followCounts.followers} followers
          </h3>

          {/* Bio */}
          {user.bio ? (
            <h4 className="text-cream" style={{ opacity: 0.8 }}>
              {user.bio}
            </h4>
          ) : (
            <h4 className="text-cream" style={{ opacity: 0.5 }}>
              no bio yet. #boring
            </h4>
          )}

          {/* Follow Button */}
          {currentUser && !isOwnProfile && (
            <button
              className={`btn ${
                isFollowing ? "btn-outline-light" : "btn-orange"
              } mt-2`}
              onClick={handleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}

          {isOwnProfile && (
            <Link href="/Account/Profile">
              <button className="btn btn-outline-light mt-2">
                Edit Profile
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* User's Recent Reviews */}
      <div className="mb-5" style={{ marginTop: "60px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-orange mb-0">{user.username}&apos;s recents</h5>
          {reviews.length > 4 && (
            <Link
              href={`/Profile/${userId}/reviews`}
              className="text-white text-decoration-none"
            >
              see all
            </Link>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="row g-3">
            {reviews.slice(0, 4).map((review) => (
              <div key={review._id} className="col-6 col-md-3">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        ) : (
          <div className="groove-card p-4 text-center">
            <p className="text-cream mb-0">No reviews yet</p>
          </div>
        )}
      </div>

      {/* User's Crates (PRO/ADMIN only) */}
      {isProUser && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-orange mb-0">{user.username}&apos;s crates</h5>
            {crates.length > 0 && (
              <Link
                href={`/Profile/${userId}/crates`}
                className="text-white text-decoration-none"
              >
                see all
              </Link>
            )}
          </div>

          {crates.length > 0 ? (
            <div className="row g-3">
              {crates.slice(0, 3).map((crate) => (
                <div key={crate._id} className="col-6 col-md-4">
                  <Link
                    href={`/Crates/${crate._id}`}
                    className="text-decoration-none"
                  >
                    <div className="groove-card p-3 text-center">
                      {/* Crate Preview */}
                      <div
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: "8px",
                          overflow: "hidden",
                          marginBottom: "12px",
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        <Image
                          src="/crate.png"
                          alt={crate.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <h6 className="text-white mb-0">{crate.title}</h6>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="groove-card p-4 text-center">
              <p className="text-cream mb-0">No crates yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
