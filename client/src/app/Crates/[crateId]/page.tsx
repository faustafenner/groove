/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FaCrown } from "react-icons/fa";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function CrateDetailsPage() {
  const params = useParams();
  const crateId = params.crateId as string;

  const [crate, setCrate] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isProUser = user && (user.role === "PRO" || user.role === "ADMIN");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch crate details
        const crateRes = await axios.get(
          `${HTTP_SERVER}/api/crates/${crateId}`
        );
        setCrate(crateRes.data);

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
        <h4 className="text-white">{crate.title}</h4>
        {crate.description && (
          <p className="text-cream" style={{ opacity: 0.7 }}>
            {crate.description}
          </p>
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
