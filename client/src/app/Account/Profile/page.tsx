/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../../store";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FaCrown, FaPencilAlt } from "react-icons/fa";
import { setCurrentUser } from "../reducer";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

// Available avatar options
const AVATAR_OPTIONS = [
  "/avatars/beyonce.png",
  "/avatars/mad.png",
  "/avatars/ari.png",
  "/avatars/bad.png",
  "/avatars/dance.png",
  "/avatars/prof.png",
  "/avatars/poot.png",
  "/avatars/cardi.png",
];

export default function EditProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const isProUser =
    currentUser && (currentUser.role === "PRO" || currentUser.role === "ADMIN");

  const handleAvatarSelect = (avatarPath: string) => {
    setAvatar(avatarPath);
    setAvatarPreview(null);
    setAvatarFile(null);
    setShowAvatarSelector(false);
  };

  const handleSaveAll = async () => {
    if (!currentUser) return;

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // For now, avatar uploads aren't supported - you can only use avatar URLs
      if (avatarFile) {
        setMessage({
          type: "error",
          text: "Avatar file upload not yet supported. Please use an image URL instead.",
        });
        setSaving(false);
        return;
      }

      // Save profile data
      const updateData: any = {
        username,
        bio,
        email,
        avatar, // Save avatar URL if provided
      };

      const res = await axiosWithCredentials.put(
        `${HTTP_SERVER}/api/users/${currentUser._id}`,
        updateData
      );

      dispatch(setCurrentUser(res.data));
      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Navigate to public profile after a short delay
      setTimeout(() => {
        router.push(`/Profile/${currentUser._id}`);
      }, 1000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosWithCredentials.post(`${HTTP_SERVER}/api/users/signout`);
      dispatch(setCurrentUser(null));
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-5 text-cream">
        Please log in to edit your profile
      </div>
    );
  }

  const displayAvatar = avatarPreview || avatar;

  return (
    <div
      style={{
        backgroundImage: "url(/frequency2.png)",
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      {/* Profile Content */}
      <div
        className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-5"
        style={{ paddingTop: "60px" }}
      >
        {/* Avatar with Edit */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 250,
              height: 250,
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#4a2045",
              border: "4px solid white",
            }}
          >
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt={username}
                width={250}
                height={250}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                style={{
                  fontSize: "80px",
                  fontWeight: "bold",
                  color: "#D76A05",
                }}
              >
                {username[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Avatar Edit Button */}
          <button
            onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              backgroundColor: "#2a1a2a",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px solid #4a2045",
            }}
          >
            <FaPencilAlt color="#888" size={16} />
          </button>

          {/* Avatar Selector Modal */}
          {showAvatarSelector && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: "10px",
                backgroundColor: "#2a1a2a",
                borderRadius: "12px",
                padding: "20px",
                border: "2px solid #4a2045",
                zIndex: 1000,
                minWidth: "300px",
              }}
            >
              <h6 className="text-white mb-3 text-center">Choose Avatar</h6>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >
                {AVATAR_OPTIONS.map((avatarPath) => (
                  <div
                    key={avatarPath}
                    onClick={() => handleAvatarSelect(avatarPath)}
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        avatar === avatarPath
                          ? "3px solid #D76A05"
                          : "2px solid #555",
                    }}
                  >
                    <Image
                      src={avatarPath}
                      alt="Avatar option"
                      width={70}
                      height={70}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info Fields */}
        <div className="text-start" style={{ minWidth: 300 }}>
          {/* Username Field */}
          <div className="mb-4 d-flex align-items-center gap-3">
            <FaPencilAlt
              color="#555"
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => setEditingField("username")}
            />
            {isProUser && (
              <FaCrown
                size={32}
                style={{
                  color: "#F5A623",
                }}
              />
            )}
            {editingField === "username" ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setEditingField(null)}
                autoFocus
                className="form-control"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #D76A05",
                  borderRadius: 0,
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  padding: "0 5px",
                }}
              />
            ) : (
              <h1
                className="text-white mb-0"
                style={{ cursor: "pointer" }}
                onClick={() => setEditingField("username")}
              >
                {username}
              </h1>
            )}
          </div>

          {/* Bio Field */}
          <div className="mb-4 d-flex align-items-start gap-3">
            <FaPencilAlt
              color="#555"
              size={20}
              style={{ cursor: "pointer", marginTop: 5 }}
              onClick={() => setEditingField("bio")}
            />
            {editingField === "bio" ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => setEditingField(null)}
                autoFocus
                placeholder="insert bio here."
                className="form-control"
                rows={2}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #D76A05",
                  borderRadius: 0,
                  color: "white",
                  fontSize: "1.1rem",
                  padding: "0 5px",
                  resize: "none",
                }}
              />
            ) : (
              <p
                className="text-white mb-0"
                style={{ cursor: "pointer", fontSize: "1.1rem" }}
                onClick={() => setEditingField("bio")}
              >
                {bio || "insert bio here."}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-4 d-flex align-items-center gap-3">
            <FaPencilAlt
              color="#555"
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => setEditingField("email")}
            />
            {editingField === "email" ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEditingField(null)}
                autoFocus
                className="form-control"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #D76A05",
                  borderRadius: 0,
                  color: "white",
                  fontSize: "1.1rem",
                  padding: "0 5px",
                }}
              />
            ) : (
              <p
                className="text-white mb-0"
                style={{ cursor: "pointer", fontSize: "1.1rem" }}
                onClick={() => setEditingField("email")}
              >
                {email}
              </p>
            )}
          </div>

          {/* Status Display (non-editable) */}
          <div className="mb-4 d-flex align-items-center justify-content-between">
            <p className="text-white mb-0" style={{ fontSize: "1.1rem" }}>
              Status:{" "}
              <span style={{ fontWeight: "bold" }}>
                {currentUser.role || "USER"}
              </span>
            </p>
            <Link href={`/Profile/${currentUser._id}`}>
              <button
                className="btn btn-outline-light btn-sm"
                style={{ fontSize: "0.9rem" }}
              >
                View Public Profile
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`text-center mt-4 ${
            message.type === "success" ? "text-success" : "text-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div
        className="d-flex flex-column align-items-center gap-3"
        style={{ marginTop: "60px" }}
      >
        <button
          className="btn btn-outline-light px-5 py-2"
          onClick={handleSaveAll}
          disabled={saving}
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            minWidth: 200,
          }}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>

        <button
          className="btn btn-outline-light px-5 py-2"
          onClick={handleLogout}
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 200,
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
