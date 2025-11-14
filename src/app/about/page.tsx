import Link from "next/link";

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f9",
        padding: "4rem 1rem",
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          background: "linear-gradient(135deg, #2563eb, #1e3a8a)",
          padding: "4rem 2rem",
          borderRadius: "12px",
          color: "white",
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto 3rem auto",
        }}
      >
        <h1 style={{ fontSize: "2.75rem", fontWeight: 700, marginBottom: "1rem" }}>
          About This Music Application
        </h1>
        <p style={{ fontSize: "1.25rem", opacity: 0.95 }}>
          A modern full-stack music catalog built with Next.js and PostgreSQL.
        </p>
      </section>

      {/* CONTENT SECTION */}
      <section
        style={{
          background: "white",
          padding: "3rem 2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ fontWeight: 600, marginBottom: "1rem", textAlign: "center" }}>
          Project Lead: <span style={{ color: "#2563eb" }}>Leo Godinez</span>
        </h2>

        <p style={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
          This application is a full-stack music catalog built with{" "}
          <strong>Next.js</strong> on the frontend and a{" "}
          <strong>PostgreSQL</strong> database on the backend. It demonstrates
          server-side rendering, typed API design, reusable UI components, and
          professional full-stack application structure.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: 1.7, marginTop: "1.25rem" }}>
          The purpose of this project is to show how a modern Next.js
          application can:
        </p>

        <ul style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
          <li>Render content on the server for speed and SEO improvements.</li>
          <li>Communicate with a cloud-hosted database using internal API routes.</li>
          <li>Use reusable components like <code>AlbumCard</code> and <code>AlbumList</code>.</li>
          <li>Manage both local and cloud deployments cleanly.</li>
        </ul>

        <p style={{ fontSize: "1.1rem", lineHeight: 1.7, marginTop: "1.25rem" }}>
          Every album displayed in the app is loaded from a live backend
          database. The UI is intentionally clean, minimal, and optimized for
          readability — with a focus on the music itself.
        </p>

        <div
          style={{
            marginTop: "2.5rem",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            className="btn btn-primary"
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1.1rem",
              borderRadius: "8px",
            }}
          >
           Home
          </Link>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "2.5rem",
            color: "#888",
            fontSize: "0.95rem",
          }}
        >
        </p>
      </section>
    </main>
  );
}
