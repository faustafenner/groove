"use client";

import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";

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
}

export default function ReviewCard({
  review,
  showAlbum = true,
}: ReviewCardProps) {
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

      <p className="mt-2 mb-0 small text-cream" style={{ opacity: 0.9 }}>
        {review.content.length > 100
          ? `${review.content.substring(0, 100)}...`
          : review.content}
      </p>
    </div>
  );
}
