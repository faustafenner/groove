/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReviewCard from "@/components/ReviewCard";
import axios from "axios";
import { FaCrown } from "react-icons/fa";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function UserReviewsPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isProUser = user && (user.role === "PRO" || user.role === "ADMIN");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reviewsRes] = await Promise.all([
          axios.get(`${HTTP_SERVER}/api/users/${userId}`),
          axios.get(`${HTTP_SERVER}/api/reviews/user/${userId}`),
        ]);

        setUser(userRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const refreshReviews = async () => {
    try {
      const response = await axios.get(
        `${HTTP_SERVER}/api/reviews/user/${userId}`
      );
      setReviews(response.data);
    } catch (err) {
      console.error(err);
    }
  };

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
      {/* User Header */}
      <Link
        href={`/Profile/${userId}`}
        className="text-decoration-none d-flex align-items-center gap-3 mb-4"
      >
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
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
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
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="d-flex align-items-center gap-2">
            {isProUser && <FaCrown size={20} style={{ color: "#F5A623" }} />}
            <h4 className="text-white mb-0">{user.username}</h4>
          </div>
          <p className="text-cream mb-0" style={{ opacity: 0.7 }}>
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </p>
        </div>
      </Link>

      {/* All Reviews */}
      <div className="mb-4">
        <h5 className="text-orange mb-3">All Reviews</h5>
        {reviews.length > 0 ? (
          <div className="row g-3">
            {reviews.map((review) => (
              <div key={review._id} className="col-6 col-md-4 col-lg-3">
                <ReviewCard review={review} onDelete={refreshReviews} />
              </div>
            ))}
          </div>
        ) : (
          <div className="groove-card p-4 text-center">
            <p className="text-cream mb-0">No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
