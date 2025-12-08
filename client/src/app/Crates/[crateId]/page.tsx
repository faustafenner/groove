/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { FaCrown, FaEdit, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa";
import * as crateClient from "@/app/Crates/client";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function CrateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const crateId = params.crateId as string;
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [crate, setCrate] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isProUser = user && (user.role === "PRO" || user.role === "ADMIN");
  const isOwner = currentUser && user && currentUser._id === user._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch crate details
        const crateRes = await axios.get(
          `${HTTP_SERVER}/api/crates/${crateId}`
        );
        setCrate(crateRes.data);
        setEditTitle(crateRes.data.title);
        setEditDescription(crateRes.data.description || "");

        // Set albums from the crate data (they're embedded)
        if (crateRes.data.albums && crateRes.data.albums.length > 0) {
          setAlbums(crateRes.data.albums);
        }

        // Fetch user who owns the crate
        if (crateRes.data.user && typeof crateRes.data.user === "object") {
          setUser(crateRes.data.user);
        } else if (crateRes.data.user) {
          const userRes = await axios.get(
            `${HTTP_SERVER}/api/users/${crateRes.data.user}`
          );
          setUser(userRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [crateId]);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const count = await crateClient.getCrateLikeCount(crateId);
        setLikeCount(count);
        if (currentUser) {
          const liked = await crateClient.checkIfCrateLiked(crateId);
          setIsLiked(liked);
        }
      } catch (error) {
        console.error("Error fetching like data:", error);
      }
    };
    fetchLikeData();
  }, [crateId, currentUser]);

  const handleLike = async () => {
    if (!currentUser || likeLoading) return;
    setLikeLoading(true);
    try {
      if (isLiked) {
        const newCount = await crateClient.unlikeCrate(crateId);
        setLikeCount(newCount);
        setIsLiked(false);
      } else {
        const newCount = await crateClient.likeCrate(crateId);
        setLikeCount(newCount);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
    setLikeLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this crate?")) return;
    try {
      await crateClient.deleteCrate(crateId);
      router.push("/Crates");
    } catch (error) {
      console.error("Error deleting crate:", error);
      alert("Failed to delete crate");
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await crateClient.updateCrate(crateId, {
        title: editTitle,
        description: editDescription,
      });
      setCrate(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating crate:", error);
      alert("Failed to update crate");
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(crate.title);
    setEditDescription(crate.description || "");
    setIsEditing(false);
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

  if (!crate) {
    return <div className="text-center py-5 text-cream">Crate not found</div>;
  }

  return (
    <div>
      {/* Header with User Info */}
      <Link
        href={`/Profile/${user?._id}/crates`}
        className="text-decoration-none"
      >
        <div className="d-flex align-items-center gap-3 mb-3">
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
            {user?.avatar ? (
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
                {user?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Username with Crown */}
          <div className="d-flex align-items-center gap-2">
            {isProUser && <FaCrown size={20} style={{ color: "#F5A623" }} />}
            <h5 className="text-white mb-0">{user?.username}&apos;s crates</h5>
          </div>
        </div>
      </Link>

      {/* Crate Title */}
      <div className="text-center mb-4">
        {isEditing ? (
          <div className="mx-auto" style={{ maxWidth: "500px" }}>
            <input
              type="text"
              className="form-control mb-2 bg-purple-light text-white border-0"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Crate title"
            />
            <textarea
              className="form-control mb-2 bg-purple-light text-white border-0"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
            />
            <div className="d-flex gap-2 justify-content-center">
              <button onClick={handleUpdate} className="btn btn-cream">
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn"
                style={{ border: "1px solid #888", color: "#f2e9e9" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <h4 className="text-white mb-0">{crate.title}</h4>
              {isOwner && (
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
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
            {crate.description && (
              <p className="text-cream" style={{ opacity: 0.7 }}>
                {crate.description}
              </p>
            )}
            {/* Like button */}
            <div className="d-flex justify-content-center mt-3">
              <button
                onClick={handleLike}
                disabled={!currentUser || likeLoading}
                className="btn btn-sm d-flex align-items-center gap-2"
                style={{
                  background: "transparent",
                  border: "1px solid " + (isLiked ? "#d76a05" : "#888"),
                  color: isLiked ? "#d76a05" : "#f2e9e9",
                  padding: "6px 12px",
                }}
              >
                {isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
                <span>
                  {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Albums Grid - 4 columns like the design */}
      {albums.length > 0 ? (
        <div className="row g-2">
          {albums.map((album) => (
            <div key={album.spotifyAlbumId} className="col-3">
              <Link
                href={`/Album/${album.spotifyAlbumId}`}
                className="text-decoration-none"
              >
                <div
                  style={{
                    aspectRatio: "1/1",
                    position: "relative",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={album.albumImage || "/default-album.png"}
                    alt={album.albumName}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <p
                  className="text-white text-center mb-0"
                  style={{
                    fontSize: "0.7rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: "4px",
                  }}
                >
                  {album.albumName}
                </p>
                <p
                  className="text-cream text-center mb-0"
                  style={{
                    fontSize: "0.6rem",
                    opacity: 0.7,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {album.artistName}
                </p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="text-cream">No albums in this crate yet</p>
        </div>
      )}
    </div>
  );
}
