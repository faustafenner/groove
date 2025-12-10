/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FaCrown } from "react-icons/fa";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function CratesDiscoveryPage() {
  const [recentCrates, setRecentCrates] = useState<any[]>([]);
  const [discoverCrates, setDiscoverCrates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrates = async () => {
      try {
        const [recentRes, publicRes] = await Promise.all([
          axios.get(`${HTTP_SERVER}/api/crates/recent?limit=12`),
          axios.get(`${HTTP_SERVER}/api/crates/public`),
        ]);

        setRecentCrates(recentRes.data);

        // Randomly shuffle and pick 8 crates for discover section
        const allCrates = publicRes.data;
        const shuffled = [...allCrates].sort(() => Math.random() - 0.5);
        setDiscoverCrates(shuffled.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCrates();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const CrateCard = ({ crate }: { crate: any }) => {
    const isProUser =
      crate.user && (crate.user.role === "PRO" || crate.user.role === "ADMIN");

    return (
      <div>
        <Link href={`/Crates/${crate._id}`} className="text-decoration-none">
          <div
            style={{
              borderRadius: "8px",
              padding: "0px",
              aspectRatio: "2/1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "90%",
                aspectRatio: "1/1",
                position: "relative",
              }}
            >
              <Image
                src="/crate.png"
                alt={crate.title}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <p
            className="text-white text-center mt-0 mb-1"
            style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)" }}
          >
            {crate.title}
          </p>
        </Link>

        {/* Creator Info */}
        {crate.user && (
          <Link
            href={`/Profile/${crate.user._id}`}
            className="text-decoration-none d-flex align-items-center justify-content-center gap-1"
          >
            <div
              style={{
                width: "clamp(20px, 5vw, 30px)",
                height: "clamp(20px, 5vw, 30px)",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              {crate.user.avatar ? (
                <Image
                  src={crate.user.avatar}
                  alt={crate.user.username}
                  width={30}
                  height={30}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              ) : (
                <div
                  className="w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{
                    fontSize: "clamp(8px, 2vw, 10px)",
                    color: "#D76A05",
                  }}
                >
                  {crate.user.username[0].toUpperCase()}
                </div>
              )}
            </div>
            {isProUser && <FaCrown size={12} style={{ color: "#F5A623" }} />}
            <span
              className="text-cream"
              style={{
                fontSize: "clamp(0.625rem, 2vw, 0.75rem)",
                opacity: 0.7,
              }}
            >
              {crate.user.username}
            </span>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Page Title */}
      <h2 className="text-cream mb-1 text-center">Crates</h2>
      <h5 className="text-cream text-center" style={{ opacity: 0.5 }}>
        for the collectors out there
      </h5>

      {/* Recently Created */}
      <div className="mb-5">
        <h5 className="text-orange mb-3">Recently Created</h5>
        {recentCrates.length > 0 ? (
          <div className="row g-3">
            {recentCrates.slice(0, 8).map((crate) => (
              <div key={crate._id} className="col-6 col-md-4 col-lg-3">
                <CrateCard crate={crate} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-cream mb-0">No crates yet</p>
          </div>
        )}
      </div>

      {/* Discover new collections */}
      <div>
        <h5 className="text-orange mb-3">Discover New Music</h5>
        {discoverCrates.length > 0 ? (
          <div className="row g-3">
            {discoverCrates.map((crate) => (
              <div key={crate._id} className="col-6 col-md-4 col-lg-3">
                <CrateCard crate={crate} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-cream mb-0">No crates yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
