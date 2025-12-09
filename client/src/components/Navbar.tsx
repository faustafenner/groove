"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Logo from "./Logo";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/Home" || pathname === "/";

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-3 py-2"
      style={{
        backgroundColor: "#33142F",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid #4a2045",
      }}
    >
      {/* Menu Button */}
      <button
        className="btn text-white"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ border: "none" }}
      >
        <FaBars size={24} />
      </button>

      {/* Logo - Hidden on Home Page - Absolutely positioned to stay centered */}
      {!isHomePage && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Link href="/Home" className="text-decoration-none">
            <Logo size="sm" />
          </Link>
        </div>
      )}

      {/* Sign In / Profile */}
      {currentUser ? (
        <Link
          href="/Account/Profile"
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
          <span className="text-white small d-none d-sm-inline">
            {currentUser.username}
          </span>
          <div
            style={{
              width: 36,
              height: 36,
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
            {currentUser.avatar ? (
              <Image
                src={currentUser.avatar}
                alt={currentUser.username}
                width={36}
                height={36}
                style={{ objectFit: "cover" }}
              />
            ) : (
              currentUser.username[0].toUpperCase()
            )}
          </div>
        </Link>
      ) : (
        <Link
          href="/Account/Signin"
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
          <span className="text-white">Sign In</span>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Image
              src="/noProfileImage.png"
              alt="Guest"
              width={36}
              height={36}
              style={{ objectFit: "cover" }}
            />
          </div>
        </Link>
      )}

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="position-absolute p-3 rounded"
          style={{
            top: "60px",
            left: "10px",
            minWidth: "200px",
            backgroundColor: "#4a2045",
            zIndex: 200,
          }}
        >
          <Link
            href="/Home"
            className="d-block text-white text-decoration-none py-2"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/Search"
            className="d-block text-white text-decoration-none py-2"
            onClick={() => setMenuOpen(false)}
          >
            Albums
          </Link>
          <Link
            href="/Crates"
            className="d-block text-white text-decoration-none py-2"
            onClick={() => setMenuOpen(false)}
          >
            Crates
          </Link>
          {currentUser && (
            <Link
              href="/People"
              className="d-block text-white text-decoration-none py-2"
              onClick={() => setMenuOpen(false)}
            >
              People
            </Link>
          )}
          {currentUser && currentUser.role === "ADMIN" && (
            <Link
              href="/Admin/Users"
              className="d-block text-decoration-none py-2"
              style={{ color: "#D76A05" }}
              onClick={() => setMenuOpen(false)}
            >
              Manage Users
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
