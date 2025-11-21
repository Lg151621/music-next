"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const role = session?.user?.role as "admin" | "user" | undefined;

  // If already logged in, show a simple status + actions
  if (session) {
    return (
      <main className="main-content container">
        <h2 className="mb-3">You&apos;re already signed in</h2>
        <p className="mb-1">
          Email: <strong>{session.user?.email}</strong>
        </p>
        <p className="mb-4">
          Role:{" "}
          <strong style={{ textTransform: "capitalize" }}>
            {role ?? "user"}
          </strong>
        </p>

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => router.push("/")}
          >
            Go to Home
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </button>
        </div>
      </main>
    );
  }

  // Guest view: choose User vs Admin login (conceptually)
  return (
    <main className="main-content container">
      <h2 className="mb-4">Sign in to Music App</h2>
      <p className="text-muted mb-4">
        Choose how you want to sign in. The same GitHub login is used, but your
        email determines whether you&apos;re treated as a regular user or an
        admin.
      </p>

      <div className="row g-4">
        {/* User login card */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h4 className="card-title">User Login</h4>
              <p className="card-text flex-grow-1">
                Sign in with any GitHub account to browse albums and use the
                <strong> View</strong> feature. This is the normal user role.
              </p>
              <button
                type="button"
                className="btn btn-dark mt-2"
                onClick={() => signIn("github", { callbackUrl: "/" })}
              >
                Continue with GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Admin login card */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h4 className="card-title">Admin Login</h4>
              <p className="card-text flex-grow-1">
                Use your approved admin GitHub email to manage the catalog. Only
                emails listed in <code>ADMIN_EMAILS</code> will receive the
                <strong> admin</strong> role (with Edit and New Album access).
                Other emails will be treated as normal users.
              </p>
              <button
                type="button"
                className="btn btn-outline-dark mt-2"
                onClick={() => signIn("github", { callbackUrl: "/" })}
              >
                Continue as Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
