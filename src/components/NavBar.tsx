"use client";

import React, { JSX } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar(): JSX.Element {
  const { data: session } = useSession();

  // Extract initials safely
  const initial =
    session?.user?.name?.[0]?.toUpperCase() ??
    session?.user?.email?.[0]?.toUpperCase() ??
    "U";

  // Admin role
  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Brand = home */}
        <Link href="/" className="navbar-brand">
          Music App
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Collapsible nav */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* 🔐 New Album only for Admins */}
            {session && isAdmin && (
              <li className="nav-item">
                <Link href="/new" className="nav-link">
                  New Album
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link href="/about" className="nav-link">
                About
              </Link>
            </li>
          </ul>

          {/* ===== RIGHT SIDE AUTH SECTION ===== */}
          <div className="d-flex align-items-center">
            {/* Logged in */}
            {session ? (
              <div className="user-avatar-wrapper">
                <div className="user-avatar" role="button">
                  {initial}
                </div>

                <div className="user-tooltip">
                  <div className="user-tooltip-line">Signed in as</div>
                  <div className="user-tooltip-email">
                    {session.user?.email}
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light mt-2"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* Not signed in → GO TO CUSTOM LOGIN PAGE */
              <Link href="/login">
                <button type="button" className="btn btn-outline-primary btn-sm">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
