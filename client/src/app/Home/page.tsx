/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store";
import Logo from "@/components/Logo";
import ReviewCard from "@/components/ReviewCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function HomePage() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReviewsLoading, setUserReviewsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRecentReviews = async () => {
      try {
        const response = await axios.get(`${HTTP_SERVER}/api/reviews/recent`);
        if (isMounted) {
          setRecentReviews(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecentReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch user's reviews if logged in
  useEffect(() => {
    let isMounted = true;

    const fetchUserReviews = async () => {
      if (!currentUser) {
        setUserReviews([]);
        return;
      }

      setUserReviewsLoading(true);
      try {
        const response = await axios.get(
          `${HTTP_SERVER}/api/reviews/user/${currentUser._id}`
        );
        if (isMounted) {
          setUserReviews(response.data);
          setUserReviewsLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setUserReviewsLoading(false);
        }
      }
    };

    fetchUserReviews();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return (
    <div className="text-center">
      {/* Hero Logo */}
      <div className="py-5">
        <Logo size="lg" />
        <h2 className="text-cream mt-3" style={{ opacity: 0.9 }}>
          F*ck the Recording Academy, You&apos;re Rating Albums Now.
        </h2>
      </div>

      {/* Call to action for anonymous users
      {!currentUser && (
        <div className="mb-5">
          <Link href="/Account/Signup" className="btn btn-orange btn-lg me-2">
            Get Started
          </Link>
          <Link href="/Search" className="btn btn-outline-light btn-lg">
            Browse Albums
          </Link>
        </div>
      )}

      {/* Logged in user greeting */}
      {/* {currentUser && (
        <div className="mb-5">
          <p className="text-cream">
            Welcome back,{" "}
            <span className="text-orange">{currentUser.username}</span>!
          </p>
          <Link href="/Search" className="btn btn-orange">
            Find Albums to Review
          </Link>
        </div>
      )} */}

      {/* Recent Buzz Section */}
      <div className="text-start mt-5">
        <h5 className="text-orange mb-3">Recent Buzz</h5>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recentReviews.length > 0 ? (
          <div className="row g-3">
            {recentReviews.slice(0, 4).map((review) => (
              <div key={review._id} className="col-6 col-md-4 col-lg-3">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        ) : (
          <div className="groove-card p-4 text-center">
            <p className="text-cream mb-3">No reviews yet. Be the first!</p>
            <Link href="/Search">
              <button className="btn btn-orange">Search Albums</button>
            </Link>
          </div>
        )}
      </div>

      <br></br>

      {/* User's Recent Reviews - Only for logged in users */}
      {currentUser && (
        <div className="text-start mb-5">
          <h5 className="text-orange mb-3">Your Recent Reviews</h5>
          {userReviewsLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : userReviews.length > 0 ? (
            <div className="row g-3">
              {userReviews.slice(0, 4).map((review) => (
                <div key={review._id} className="col-6 col-md-4 col-lg-3">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          ) : (
            <div className="groove-card p-4 text-center">
              <p className="text-cream mb-3">
                You haven&apos;t written any reviews yet.
              </p>
              <Link href="/Search">
                <button className="btn btn-orange">
                  Find Albums to Review
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Prompt for anonymous users */}
      {!currentUser && (
        <div className="mt-5 pt-4">
          <Link href="/Account/Signup" className="text-orange">
            Want to get in on the Buzz? Create an Account.
          </Link>
        </div>
      )}
    </div>
  );
}
