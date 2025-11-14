import Link from "next/link";
import "@/components/App.css";

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* HERO SECTION */}
      <section className="about-hero">
        <h1 className="about-hero-title">
          About This Music Application
        </h1>
        <p className="about-hero-subtitle">
          A modern full-stack music catalog built with Next.js and PostgreSQL.
        </p>
      </section>

      {/* CONTENT SECTION */}
      <section className="about-content">
        <h2 className="about-project-lead">
          Project Lead:{" "}
          <span className="about-project-lead-name">Leo Godinez</span>
        </h2>

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

        <ul className="about-list">
          <li>Render content on the server for speed and SEO improvements.</li>
          <li>Communicate with a cloud-hosted database using internal API routes.</li>
          <li>
            Use reusable components like <code>AlbumCard</code> and{" "}
            <code>AlbumList</code>.
          </li>
          <li>Manage both local and cloud deployments cleanly.</li>
        </ul>

        <p className="about-text about-text--spaced">
          Every album displayed in the app is loaded from a live backend
          database. The UI is intentionally clean, minimal, and optimized for
          readability with a focus on the music itself.
        </p>

        <div className="about-home-container">
          <Link
            href="/"
            className="btn btn-primary about-home-link"
          >
            Home
          </Link>
        </div>

        <p className="about-footer">
          {/* Optional footer text if you want something here later */}
        </p>
      </section>
    </main>
  );
}
