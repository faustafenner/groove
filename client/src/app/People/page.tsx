/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { FaSearch, FaCrown } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function PeoplePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const criteriaFromUrl = searchParams.get("criteria") || "";

  const [query, setQuery] = useState(criteriaFromUrl);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!criteriaFromUrl);
  const [discoverUsers, setDiscoverUsers] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication status
  useEffect(() => {
    // Wait a moment for Redux to hydrate
    const timer = setTimeout(() => {
      setCheckingAuth(false);
      if (!currentUser) {
        router.push("/Account/Signin");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, router]);

  const performSearch = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(
        `${HTTP_SERVER}/api/users/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      setResults(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  // Fetch search results when URL parameter changes
  useEffect(() => {
    const fetchData = async () => {
      if (criteriaFromUrl) {
        await performSearch(criteriaFromUrl);
      }
    };
    fetchData();
  }, [criteriaFromUrl, performSearch]);

  // Fetch random users on page load (only if no search criteria)
  useEffect(() => {
    if (!currentUser) return; // Don't fetch if not logged in

    const fetchRandomUsers = async () => {
      if (!criteriaFromUrl) {
        try {
          const response = await axios.get(`${HTTP_SERVER}/api/users/search`);
          const allUsers = response.data;

          // Randomly shuffle and pick users
          const shuffled = [...allUsers].sort(() => Math.random() - 0.5);
          setDiscoverUsers(shuffled.slice(0, 12));
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      }
      setInitialLoading(false);
    };

    fetchRandomUsers();
  }, [criteriaFromUrl, currentUser]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update URL with search criteria
    router.push(`/People?criteria=${encodeURIComponent(query)}`);
  };

  // Determine which users to display
  const displayUsers = searched ? results : discoverUsers;
  const isLoading = searched ? loading : initialLoading;

  if (checkingAuth || !currentUser) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="d-flex justify-content-center">
          <div
            className="position-relative"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <FaSearch
              className="position-absolute text-muted"
              style={{
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="search-bar w-100 ps-5"
            />
          </div>
        </div>
      </form>

      {/* Section Title */}
      {!searched && !initialLoading && discoverUsers.length > 0 && (
        <h2 className="text-cream text-center mb-4">
          Discover <span className="text-orange">Users</span>
        </h2>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && displayUsers.length > 0 && (
        <div className="row g-4">
          {displayUsers.map((user) => {
            const isProUser = user.role === "PRO" || user.role === "ADMIN";

            return (
              <div key={user._id} className="col-6 col-md-4 col-lg-3">
                <Link
                  href={`/Profile/${user._id}`}
                  className="text-decoration-none"
                >
                  <div className="groove-card p-3 text-center">
                    {/* Avatar */}
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        borderRadius: "50%",
                        overflow: "hidden",
                        backgroundColor: "#4a2045",
                        marginBottom: "12px",
                        position: "relative",
                      }}
                    >
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{
                            fontSize: "48px",
                            fontWeight: "bold",
                            color: "#D76A05",
                          }}
                        >
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Username with crown for PRO */}
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <h6 className="text-white mb-0">{user.username}</h6>
                      {isProUser && (
                        <FaCrown size={14} style={{ color: "#f5d245" }} />
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {!isLoading && searched && results.length === 0 && (
        <div className="text-center py-5 text-cream">
          No users found. Try a different search.
        </div>
      )}
    </div>
  );
}
