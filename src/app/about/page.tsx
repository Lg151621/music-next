import Link from "next/link";
import "@/components/App.css";
import NavBar from "@/components/NavBar";

// This file becomes the "/about" route.
// In the App Router, app/about/page.tsx automatically maps to /about.
export default function AboutPage() {
  // Notice: there is NO "use client" at the top.
  // That means this is a Server Component by default.
  // Next.js will render this page on the server (SSR) and send the HTML to the browser.
  return (
    <>
      {/* Reusable navigation bar displayed on every page of the app */}
      <NavBar />

      <main className="about-page">
        {/* ---------------- HERO SECTION ---------------- */}
        {/* Top banner area with a large title + short description */}
        <section className="about-hero">
          <h1 className="about-hero-title">
            About This Music Application
          </h1>
          <p className="about-hero-subtitle">
            A modern full-stack music catalog built with Next.js and PostgreSQL.
          </p>
        </section>

        {/* ---------------- CONTENT SECTION ---------------- */}
        {/* Main text section explaining the project and its purpose */}
        <section className="about-content">
          <h2 className="about-project-lead">
            Project Lead:{" "}
            <span className="about-project-lead-name">Leonardo Godinez</span>
          </h2>

          {/* Description of the tech and features in this project */}
          <p className="about-text">
            This application is a full-stack music catalog built with{" "}
            <strong>Next.js</strong> on the frontend and a{" "}
            <strong>PostgreSQL</strong> database on the backend. It demonstrates
            server-side rendering, typed API design, reusable UI components, and
            professional full-stack application structure.
          </p>

          <p className="about-text about-text--spaced">
            The purpose of this project is to show how a modern Next.js
            application can:
          </p>

          {/* List of the key features users learn from this project */}
          <ul className="about-list">
            <li>Render content on the server for speed and SEO improvements.</li>
            <li>Communicate with a cloud-hosted database using internal API routes.</li>
            <li>
              Use reusable components like <code>AlbumCard</code> and{" "}
              <code>AlbumList</code>.
            </li>
            <li>Manage both local and cloud deployments cleanly.</li>
          </ul>

          {/* Summary statement about the UI and design choices */}
          <p className="about-text about-text--spaced">
            Every album displayed in the app is loaded from a live backend
            database. The UI is intentionally clean, minimal, and optimized for
            readability with a focus on the music itself.
          </p>

          {/* Navigation link back to the homepage */}
          <div className="about-home-container">
            <Link
              href="/"
              className="btn btn-primary about-home-link"
            >
              Home
            </Link>
          </div>

          {/* Optional footer area in case you want to add version or credits */}
          <p className="about-footer">
            {/* Add custom footer text here later if needed */}
          </p>
        </section>
      </main>
    </>
  );
}
