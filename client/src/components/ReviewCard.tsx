"use client";

import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import * as reviewClient from "@/app/Reviews/client";
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";

interface ReviewCardProps {
  review: {
    _id: string;
    user: {
      _id: string;
      username: string;
      avatar?: string;
    };
    spotifyAlbumId: string;
    albumName: string;
    albumImage: string;
    rating: number;
    content: string;
  };
  showAlbum?: boolean;
  onDelete?: () => void;
  onEdit?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  showAlbum = true,
  onDelete,
  onEdit,
}: ReviewCardProps) {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editContent, setEditContent] = useState(review.content);

  const isOwner = currentUser && currentUser._id === review.user._id;

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const count = await reviewClient.getLikeCount(review._id);
        setLikeCount(count);
        if (currentUser) {
          const liked = await reviewClient.checkIfLiked(review._id);
          setIsLiked(liked);
        }
      } catch (error) {
        console.error("Error fetching like data:", error);
      }
    };
    fetchLikeData();
  }, [review._id, currentUser]);

  const handleLike = async () => {
    if (!currentUser || loading) return;
    setLoading(true);
    try {
      if (isLiked) {
        const newCount = await reviewClient.unlikeReview(review._id);
        setLikeCount(newCount);
        setIsLiked(false);
      } else {
        const newCount = await reviewClient.likeReview(review._id);
        setLikeCount(newCount);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewClient.deleteReview(review._id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(review._id);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !editRating) return;
    setLoading(true);
    try {
      await reviewClient.updateReview(review._id, {
        rating: editRating,
        content: editContent,
      });
      setIsEditing(false);
      if (onDelete) onDelete(); // Refresh the review list
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review");
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditRating(review.rating);
    setEditContent(review.content);
    setIsEditing(false);
  };

  return (
    <div className="review-card">
      {showAlbum && (
        <Link href={`/Album/${review.spotifyAlbumId}`}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "12px",
            }}
          >
            <Image
              src={review.albumImage || "/placeholder-album.png"}
              alt={review.albumName}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </Link>
      )}

      <div className="d-flex align-items-center gap-2 mb-2">
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#D76A05",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            overflow: "hidden",
          }}
        >
          {review.user.avatar ? (
            <Image
              src={review.user.avatar}
              alt={review.user.username}
              width={28}
              height={28}
              style={{ objectFit: "cover" }}
            />
          ) : (
            review.user.username[0].toUpperCase()
          )}
        </div>
        <Link
          href={`/Profile/${review.user._id}`}
          className="text-white text-decoration-none small"
        >
          {review.user.username}
        </Link>
      </div>

      <StarRating rating={review.rating} readonly size="sm" />

      {isEditing ? (
        <div className="mt-3">
          <div className="mb-2">
            <label className="text-cream small mb-1 d-block">Rating</label>
            <StarRating rating={editRating} onRate={setEditRating} size="sm" />
          </div>
          <div className="mb-2">
            <label className="text-cream small mb-1 d-block">Review</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="form-control bg-purple-dark text-white border-0 small"
              placeholder="What did you think?"
            />
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={loading || !editContent.trim() || !editRating}
              className="btn btn-sm btn-cream"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn btn-sm"
              style={{ border: "1px solid #888", color: "#f2e9e9" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 mb-0 small text-cream" style={{ opacity: 0.9 }}>
            {review.content.length > 100
              ? `${review.content.substring(0, 100)}...`
              : review.content}
          </p>

          {/* Like and Actions */}
          <div className="d-flex align-items-center justify-content-between mt-3">
            {/* Like button */}
            <button
              onClick={handleLike}
              disabled={!currentUser || loading}
              className="btn btn-sm d-flex align-items-center gap-1"
              style={{
                background: "transparent",
                border: "none",
                color: isLiked ? "#d76a05" : "#888",
                padding: "0",
              }}
            >
              {isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              <span className="small">{likeCount}</span>
            </button>

            {/* Edit/Delete buttons for owner */}
            {isOwner && (
              <div className="d-flex gap-2">
                <button
                  onClick={handleEdit}
                  className="btn btn-sm"
                  style={{
                    background: "transparent",
                    border: "1px solid #888",
                    color: "#f2e9e9",
                    padding: "4px 8px",
                  }}
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-sm"
                  style={{
                    background: "transparent",
                    border: "1px solid #888",
                    color: "#f2e9e9",
                    padding: "4px 8px",
                  }}
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
