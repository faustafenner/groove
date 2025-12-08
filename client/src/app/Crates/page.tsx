/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FaCrown, FaHeart } from "react-icons/fa";
import * as crateClient from "./client";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function CratesDiscoveryPage() {
  const [recentCrates, setRecentCrates] = useState<any[]>([]);
  const [topCrates, setTopCrates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [crateLikes, setCrateLikes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCrates = async () => {
      try {
        const [recentRes, publicRes] = await Promise.all([
          axios.get(`${HTTP_SERVER}/api/crates/recent?limit=12`),
          axios.get(`${HTTP_SERVER}/api/crates/public`),
        ]);

        setRecentCrates(recentRes.data);

        // Fetch like counts for all crates
        const allCrates = publicRes.data;
        const likeCounts: Record<string, number> = {};
        await Promise.all(
          allCrates.map(async (crate: any) => {
            try {
              const count = await crateClient.getCrateLikeCount(crate._id);
              likeCounts[crate._id] = count;
            } catch (err) {
              likeCounts[crate._id] = 0;
            }
          })
        );
        setCrateLikes(likeCounts);

        // Sort by likes and take top 12
        const sorted = [...allCrates].sort((a, b) => {
          return (likeCounts[b._id] || 0) - (likeCounts[a._id] || 0);
        });
        setTopCrates(sorted.slice(0, 12));
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
    const likeCount = crateLikes[crate._id] || 0;

    return (
      <div>
        <Link href={`/Crates/${crate._id}`} className="text-decoration-none">
          <div
            style={{
              borderRadius: "8px",
              padding: "10px",
              aspectRatio: "1/1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "80%",
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
            className="text-white text-center mt-2 mb-1"
            style={{ fontSize: "0.9rem" }}
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
                width: 20,
                height: 20,
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              {crate.user.avatar ? (
                <Image
                  src={crate.user.avatar}
                  alt={crate.user.username}
                  width={20}
                  height={20}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  className="w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ fontSize: "10px", color: "#D76A05" }}
                >
                  {crate.user.username[0].toUpperCase()}
                </div>
              )}
            </div>
            {isProUser && <FaCrown size={12} style={{ color: "#F5A623" }} />}
            <span
              className="text-cream"
              style={{ fontSize: "0.75rem", opacity: 0.7 }}
            >
              {crate.user.username}
            </span>
          </Link>
        )}

        {/* Like count */}
        {likeCount > 0 && (
          <div className="d-flex align-items-center justify-content-center gap-1 mt-1">
            <FaHeart size={12} style={{ color: "#d76a05" }} />
            <span
              className="text-cream"
              style={{ fontSize: "0.7rem", opacity: 0.7 }}
            >
              {likeCount}
            </span>
          </div>
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
      <h2 className="text-white mb-4">Crates</h2>

      {/* Recently Created */}
      <div className="mb-5">
        <h5 className="text-orange mb-3">Recently Created</h5>
        {recentCrates.length > 0 ? (
          <div className="row g-3">
            {recentCrates.slice(0, 8).map((crate) => (
              <div key={crate._id} className="col-3">
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

      {/* Top Crates */}
      <div>
        <h5 className="text-orange mb-3">Top Crates</h5>
        {topCrates.length > 0 ? (
          <div className="row g-3">
            {topCrates.slice(0, 8).map((crate) => (
              <div key={crate._id} className="col-3">
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
