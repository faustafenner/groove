/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import AlbumCard from "@/components/AlbumCard";
import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

const RANDOM_QUERIES = [
  "rock",
  "jazz",
  "hip hop",
  "indie",
  "pop",
  "electronic",
  "soul",
  "r&b",
  "classical",
  "folk",
  "punk",
  "metal",
  "blues",
  "country",
  "reggae",
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const criteriaFromUrl = searchParams.get("criteria") || "";

  const [query, setQuery] = useState(criteriaFromUrl);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!criteriaFromUrl);
  const [initialAlbums, setInitialAlbums] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("rock");

  const performSearch = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(
        `${HTTP_SERVER}/api/spotify/search?q=${encodeURIComponent(searchQuery)}`
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

  // Fetch random albums on page load (only if no search criteria)
  useEffect(() => {
    const fetchRandomAlbums = async () => {
      if (!criteriaFromUrl) {
        try {
          const randomQuery =
            RANDOM_QUERIES[Math.floor(Math.random() * RANDOM_QUERIES.length)];

          setSelectedGenre(randomQuery);
          const response = await axios.get(
            `${HTTP_SERVER}/api/spotify/search?q=${encodeURIComponent(
              randomQuery
            )}&limit=24`
          );
          setInitialAlbums(response.data);
        } catch (err) {
          console.error("Failed to fetch initial albums:", err);
        }
      }
      setInitialLoading(false);
    };

    fetchRandomAlbums();
  }, [criteriaFromUrl]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update URL with search criteria
    router.push(`/Search?criteria=${encodeURIComponent(query)}`);
  };

  // Determine which albums to display
  const displayAlbums = searched ? results : initialAlbums;
  const isLoading = searched ? loading : initialLoading;

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
              placeholder="Search albums..."
              className="search-bar w-100 ps-5"
            />
          </div>
        </div>
      </form>

      {/* Section Title */}
      {!searched && !initialLoading && initialAlbums.length > 0 && (
        <h2 className="text-cream text-center mb-4">
          Discover <span className="text-orange">{selectedGenre}</span>
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
      {!isLoading && displayAlbums.length > 0 && (
        <div className="row g-4">
          {displayAlbums.map((album) => (
            <div key={album.spotifyId} className="col-6 col-md-4 col-lg-3">
              <AlbumCard album={album} />
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && searched && results.length === 0 && (
        <div className="text-center py-5 text-cream">
          No albums found. Try a different search.
        </div>
      )}
    </div>
  );
}
