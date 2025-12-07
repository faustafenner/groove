/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import axios from "axios";
import { FaPlus, FaTimes, FaCheck } from "react-icons/fa";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

export default function AlbumDetailPage() {
  const params = useParams();
  const spotifyId = params.spotifyId as string;
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [album, setAlbum] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Crate modal state
  const [showCrateModal, setShowCrateModal] = useState(false);
  const [userCrates, setUserCrates] = useState<any[]>([]);
  const [loadingCrates, setLoadingCrates] = useState(false);
  const [addingToCrate, setAddingToCrate] = useState<string | null>(null);
  const [addedToCrates, setAddedToCrates] = useState<string[]>([]);

  // New crate form state
  const [showNewCrateForm, setShowNewCrateForm] = useState(false);
  const [newCrateTitle, setNewCrateTitle] = useState("");
  const [newCrateDescription, setNewCrateDescription] = useState("");
  const [newCratePublic, setNewCratePublic] = useState(true);
  const [creatingCrate, setCreatingCrate] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAlbumData = async () => {
      try {
        const [albumRes, reviewsRes] = await Promise.all([
          axios.get(`${HTTP_SERVER}/api/spotify/albums/${spotifyId}`),
          axios.get(`${HTTP_SERVER}/api/reviews/album/${spotifyId}`),
        ]);
        if (isMounted) {
          setAlbum(albumRes.data);
          setReviews(reviewsRes.data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAlbumData();

    return () => {
      isMounted = false;
    };
  }, [spotifyId]);

  const refreshReviews = async () => {
    try {
      const response = await axios.get(
        `${HTTP_SERVER}/api/reviews/album/${spotifyId}`
      );
      setReviews(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUser || !reviewRating || !reviewContent.trim()) return;

    setSubmitting(true);
    try {
      await axiosWithCredentials.post(`${HTTP_SERVER}/api/reviews`, {
        spotifyAlbumId: album.spotifyId,
        albumName: album.name,
        artistName: album.artist,
        albumImage: album.image,
        rating: reviewRating,
        content: reviewContent,
      });
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewContent("");
      refreshReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
    setSubmitting(false);
  };

  // Crate functions
  const openCrateModal = async () => {
    setShowCrateModal(true);
    setLoadingCrates(true);
    setShowNewCrateForm(false);
    setAddedToCrates([]);

    try {
      const response = await axiosWithCredentials.get(
        `${HTTP_SERVER}/api/crates/user/${currentUser?._id}`
      );
      setUserCrates(response.data);

      // Check which crates already have this album
      const alreadyIn: string[] = [];
      response.data.forEach((crate: any) => {
        if (crate.albums.some((a: any) => a.spotifyAlbumId === spotifyId)) {
          alreadyIn.push(crate._id);
        }
      });
      setAddedToCrates(alreadyIn);
    } catch (err) {
      console.error(err);
    }
    setLoadingCrates(false);
  };

  const handleAddToCrate = async (crateId: string) => {
    setAddingToCrate(crateId);
    try {
      await axiosWithCredentials.post(
        `${HTTP_SERVER}/api/crates/${crateId}/albums`,
        {
          spotifyAlbumId: album.spotifyId,
          albumName: album.name,
          artistName: album.artist,
          albumImage: album.image,
        }
      );
      setAddedToCrates((prev) => [...prev, crateId]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add to crate");
    }
    setAddingToCrate(null);
  };

  const handleRemoveFromCrate = async (crateId: string) => {
    setAddingToCrate(crateId);
    try {
      await axiosWithCredentials.delete(
        `${HTTP_SERVER}/api/crates/${crateId}/albums/${spotifyId}`
      );
      setAddedToCrates((prev) => prev.filter((id) => id !== crateId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove from crate");
    }
    setAddingToCrate(null);
  };

  const handleCreateCrate = async () => {
    if (!newCrateTitle.trim()) return;

    setCreatingCrate(true);
    try {
      const response = await axiosWithCredentials.post(
        `${HTTP_SERVER}/api/crates`,
        {
          title: newCrateTitle,
          description: newCrateDescription,
          isPublic: newCratePublic,
        }
      );

      // Add album to the new crate
      const newCrate = response.data;
      await axiosWithCredentials.post(
        `${HTTP_SERVER}/api/crates/${newCrate._id}/albums`,
        {
          spotifyAlbumId: album.spotifyId,
          albumName: album.name,
          artistName: album.artist,
          albumImage: album.image,
        }
      );

      // Update state
      setUserCrates((prev) => [newCrate, ...prev]);
      setAddedToCrates((prev) => [...prev, newCrate._id]);
      setShowNewCrateForm(false);
      setNewCrateTitle("");
      setNewCrateDescription("");
      setNewCratePublic(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create crate");
    }
    setCreatingCrate(false);
  };

  const userReview = currentUser
    ? reviews.find((r) => r.user._id === currentUser._id)
    : null;

  const canCreateCrates =
    currentUser && (currentUser.role === "PRO" || currentUser.role === "ADMIN");

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!album) {
    return <div className="text-center py-5 text-cream">Album not found</div>;
  }

  return (
    <div>
      {/* Album Header */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "300px",
              aspectRatio: "1/1",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Image
              src={album.image}
              alt={album.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="col-md-8">
          <h1 className="text-white fw-bold">{album.name}</h1>
          <p className="text-cream fs-5">
            {album.artist} • {album.releaseDate?.split("-")[0]}
          </p>

          {/* Tracklist */}
          {album.tracks && (
            <div className="mt-3">
              <h6 className="text-orange">Tracks:</h6>
              <div
                className="text-cream small"
                style={{ opacity: 0.8, maxHeight: "150px", overflowY: "auto" }}
              >
                {album.tracks.map((track: any) => (
                  <div key={track.number}>
                    {track.number}. {track.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-2 mt-4">
            {currentUser && !userReview && !showReviewForm && (
              <button
                className="btn btn-orange"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </button>
            )}

            {canCreateCrates && (
              <button
                className="btn btn-outline-light"
                onClick={openCrateModal}
              >
                Add to Crate
              </button>
            )}

            {!currentUser && (
              <p className="text-cream mb-0">
                <Link href="/Account/Signin" className="text-orange">
                  Sign in
                </Link>{" "}
                to write a review
              </p>
            )}

            {userReview && !showReviewForm && (
              <span className="text-cream align-self-center">
                You&apos;ve already reviewed this album
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && currentUser && (
        <div className="groove-card p-4 mb-4">
          <h5 className="text-white mb-3">Your Review</h5>

          <div className="mb-3">
            <label className="text-cream small mb-2 d-block">Rating</label>
            <StarRating
              rating={reviewRating}
              onRate={setReviewRating}
              size="lg"
            />
          </div>

          <div className="mb-3">
            <label className="text-cream small mb-2 d-block">Review</label>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              rows={4}
              className="form-control bg-purple-dark text-white border-0"
              placeholder="What did you think of this album?"
            />
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-orange"
              onClick={handleSubmitReview}
              disabled={submitting || !reviewRating || !reviewContent.trim()}
            >
              {submitting ? "Posting..." : "Post Review"}
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => setShowReviewForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-4">
        <h5 className="text-orange mb-3">Reviews ({reviews.length})</h5>
        {reviews.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#D76A05",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      overflow: "hidden",
                    }}
                  >
                    {review.user.avatar ? (
                      <Image
                        src={review.user.avatar}
                        alt={review.user.username}
                        width={32}
                        height={32}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      review.user.username[0].toUpperCase()
                    )}
                  </div>
                  <Link
                    href={`/Profile/${review.user._id}`}
                    className="text-white text-decoration-none"
                  >
                    {review.user.username}
                  </Link>
                </div>
                <StarRating rating={review.rating} readonly size="sm" />
                <p className="mt-2 mb-0 text-cream">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cream">No reviews yet. Be the first!</p>
        )}
      </div>

      {/* Add to Crate Modal */}
      {showCrateModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000 }}
          onClick={() => setShowCrateModal(false)}
        >
          <div
            className="groove-card p-4"
            style={{
              width: "100%",
              maxWidth: "450px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white mb-0">Add to Crate</h5>
              <button
                className="btn btn-link text-white p-0"
                onClick={() => setShowCrateModal(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Loading State */}
            {loadingCrates && (
              <div className="text-center py-4">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {/* Crate List */}
            {!loadingCrates && !showNewCrateForm && (
              <>
                {/* Create New Crate Button */}
                <button
                  className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
                  onClick={() => setShowNewCrateForm(true)}
                >
                  <FaPlus /> Create New Crate
                </button>

                {/* Existing Crates */}
                {userCrates.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {userCrates.map((crate) => {
                      const isAdded = addedToCrates.includes(crate._id);
                      const isLoading = addingToCrate === crate._id;

                      return (
                        <button
                          key={crate._id}
                          className={`btn w-100 d-flex align-items-center justify-content-between ${
                            isAdded ? "btn-success" : "btn-outline-light"
                          }`}
                          onClick={() =>
                            isAdded
                              ? handleRemoveFromCrate(crate._id)
                              : handleAddToCrate(crate._id)
                          }
                          disabled={isLoading}
                        >
                          <span className="text-start">
                            <span className="d-block">{crate.title}</span>
                            <small className="opacity-75">
                              {crate.albums.length} album
                              {crate.albums.length !== 1 ? "s" : ""}
                              {!crate.isPublic && " • Private"}
                            </small>
                          </span>
                          {isLoading ? (
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : isAdded ? (
                            <FaCheck />
                          ) : (
                            <FaPlus />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-cream text-center mb-0">
                    You don&apos;t have any crates yet. Create one!
                  </p>
                )}
              </>
            )}

            {/* New Crate Form */}
            {!loadingCrates && showNewCrateForm && (
              <div>
                <div className="mb-3">
                  <label className="form-label text-cream">Crate Name</label>
                  <input
                    type="text"
                    className="form-control bg-purple-dark text-white border-0"
                    value={newCrateTitle}
                    onChange={(e) => setNewCrateTitle(e.target.value)}
                    placeholder="My Awesome Crate"
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-cream">
                    Description (optional)
                  </label>
                  <textarea
                    className="form-control bg-purple-dark text-white border-0"
                    rows={2}
                    value={newCrateDescription}
                    onChange={(e) => setNewCrateDescription(e.target.value)}
                    placeholder="What's this crate about?"
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="newCratePublic"
                    checked={newCratePublic}
                    onChange={(e) => setNewCratePublic(e.target.checked)}
                  />
                  <label
                    className="form-check-label text-cream"
                    htmlFor="newCratePublic"
                  >
                    Make this crate public
                  </label>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-orange flex-grow-1"
                    onClick={handleCreateCrate}
                    disabled={creatingCrate || !newCrateTitle.trim()}
                  >
                    {creatingCrate ? "Creating..." : "Create & Add Album"}
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setShowNewCrateForm(false)}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
