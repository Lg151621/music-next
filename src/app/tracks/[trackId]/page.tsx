"use client";

import React, { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";

type Track = {
  id: number;
  album_id: number;
  title: string;
  number: number;
  video_url: string | null;
  lyrics: string | null;
};

type Review = {
  id: number;
  track_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
};

// In a client component, `params` is a Promise.
export default function TrackPage({
  params,
}: {
  params: Promise<{ trackId?: string }>;
}) {
  const { trackId } = use(params);

  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email ?? null;

    const adminEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS
      ?.split(",")
      .map((e) => e.trim().toLowerCase()) ?? [];

  const isAdmin = React.useMemo(() => {
    // 🔹 Dev-friendly fallback:
    // If no admin emails are configured, treat the current user as admin
    // so the moderation buttons don't disappear.
    if (adminEmails.length === 0) return true;

    if (!currentUserEmail) return false;

    return adminEmails.includes(currentUserEmail.toLowerCase());
  }, [adminEmails, currentUserEmail]);

  // Track which reviews this browser session created (for "my review")
  const [ownedReviewIds, setOwnedReviewIds] = useState<number[]>([]);

  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // form state for new review
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // -------- Helper: load reviews (no hidden filter) --------
  async function loadReviews() {
    if (!trackId) {
      setReviewsError("No track selected.");
      setReviewsLoading(false);
      return;
    }

    setReviewsLoading(true);
    setReviewsError(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

      const res = await fetch(`${base}/api/tracks/${trackId}/reviews`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to load reviews (${res.status})`);
      }

      const raw = await res.json();

      // 1) Review[]
      // 2) { reviews: Review[], ... }
      let data: Review[] = [];

      if (Array.isArray(raw)) {
        data = raw;
      } else if (raw && Array.isArray(raw.reviews)) {
        data = raw.reviews;
      }

      setReviews(data);
    } catch (err: unknown) {
      setReviewsError(
        err instanceof Error ? err.message : "Unknown error"
      );
      setReviews([]); // keep state in a safe shape
    } finally {
      setReviewsLoading(false);
    }
  }

  // -------- Load Track --------
  useEffect(() => {
    if (!trackId) {
      setError("No track selected.");
      setLoading(false);
      return;
    }

    async function loadTrack() {
      setLoading(true);
      setError(null);

      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

        const res = await fetch(`${base}/api/tracks/${trackId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load track (${res.status})`);
        }

        const data: Track = await res.json();
        setTrack(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    void loadTrack();
  }, [trackId]);

  // -------- Initial load of reviews --------
  useEffect(() => {
    void loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  // -------- Submit new review --------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!trackId) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

      const res = await fetch(`${base}/api/tracks/${trackId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: ratingInput,
          comment: commentInput.trim() === "" ? null : commentInput.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to create review (${res.status}): ${text || "Unknown error"}`
        );
      }

      const created: Review = await res.json();

      // Add the new review to the top of the list
      setReviews((prev) => [created, ...prev]);

      // Mark this review as "mine" in this session
      setOwnedReviewIds((prev) => [...prev, created.id]);

      // Clear form
      setRatingInput(5);
      setCommentInput("");
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Error submitting review"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // -------- Admin: hide/unhide review (optimistic, no refetch) --------
  async function handleToggleHidden(review: Review) {
    if (!trackId) return;

    const newHidden = !review.is_hidden;

    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, is_hidden: newHidden } : r
      )
    );

    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

      const res = await fetch(
        `${base}/api/tracks/${trackId}/reviews/${review.id}/visibility`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_hidden: newHidden }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update visibility (${res.status})`);
      }
    } catch (err: unknown) {
      // Revert optimistic change on error
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, is_hidden: review.is_hidden } : r
        )
      );

      alert(
        err instanceof Error
          ? `Error updating visibility: ${err.message}`
          : "Error updating visibility"
      );
    }
  }

  // -------- Admin/User: delete review (optimistic) --------
  async function handleDeleteReview(review: Review) {
    if (!trackId) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return;

    // Optimistic UI update
    setReviews((prev) => prev.filter((r) => r.id !== review.id));

    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

      const res = await fetch(
        `${base}/api/tracks/${trackId}/reviews/${review.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok && res.status !== 204) {
        throw new Error(`Failed to delete review (${res.status})`);
      }
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? `Error deleting review: ${err.message}`
          : "Error deleting review"
      );
      void loadReviews();
    }
  }

  // -------- Derive visible reviews + stats client-side --------
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const visibleReviews = safeReviews.filter((r) => !r.is_hidden);
  const totalVisible = visibleReviews.length;
  const averageVisible =
    totalVisible > 0
      ? visibleReviews.reduce((sum, r) => sum + r.rating, 0) / totalVisible
      : null;

  // Admin sees all reviews; normal users only see non-hidden.
  const reviewsToDisplay = isAdmin ? safeReviews : visibleReviews;

  // -------- Render States --------
  if (!trackId) {
    return (
      <div className="container p-4">
        <h2>No track selected</h2>
        <p className="text-muted">Please choose a track from an album.</p>
      </div>
    );
  }

  if (loading) return <div className="container p-4">Loading track…</div>;

  if (error)
    return (
      <div className="container p-4 text-danger">
        Failed to load track: {error}
      </div>
    );

  if (!track) return <div className="container p-4">Track not found</div>;

  return (
    <div className="container py-4">
      <h2>{track.title}</h2>
      <p className="text-muted">Track #{track.number}</p>

      {/* Lyrics */}
      <div className="card p-3 mt-3">
        <h4>Lyrics</h4>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {track.lyrics || "No lyrics available."}
        </pre>
      </div>

      {/* Video */}
      <div className="card p-3 mt-3">
        <h4>YouTube / Video</h4>
        {track.video_url ? (
          <iframe
            width="100%"
            height="315"
            src={track.video_url}
            title="Track video"
            allowFullScreen
          />
        ) : (
          <p>No video available.</p>
        )}
      </div>

      {/* Reviews */}
      <div className="card p-3 mt-3">
        <h4>Ratings &amp; Reviews</h4>

        {/* --- New Review Form --- */}
        <form className="mb-3" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Your Rating</label>
            <select
              className="form-select"
              value={ratingInput}
              onChange={(e) => setRatingInput(Number(e.target.value))}
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Okay</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Bad</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">Comment (optional)</label>
            <textarea
              className="form-control"
              rows={3}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Share your thoughts about this track..."
            />
          </div>

          {submitError && (
            <p className="text-danger small mb-2">{submitError}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <hr />

        {reviewsLoading && <p>Loading reviews…</p>}

        {reviewsError && (
          <p className="text-danger small mb-0">
            Failed to load reviews: {reviewsError}
          </p>
        )}

        {!reviewsLoading && !reviewsError && (
          <>
            {totalVisible > 0 ? (
              <p className="mb-2">
                <strong>{averageVisible?.toFixed(1)} / 5</strong> based on{" "}
                {totalVisible} review{totalVisible !== 1 && "s"}
              </p>
            ) : (
              <p className="text-muted mb-2">
                No reviews yet for this track.
              </p>
            )}

            {reviewsToDisplay.length > 0 && (
              <ul className="list-unstyled mb-0">
                {reviewsToDisplay.map((r) => {
                  // RBAC: who can see which buttons?
                  const canHide = isAdmin;
                  const canDelete =
                    isAdmin || ownedReviewIds.includes(r.id);

                  return (
                    <li
                      key={r.id}
                      className="border rounded p-2 mb-2"
                      style={{
                        background: r.is_hidden ? "#f8f9fa" : "white",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <span>
                          <strong>{r.rating} / 5</strong>
                        </span>
                        <span className="text-muted small">
                          {new Date(r.created_at).toLocaleString()}
                        </span>
                      </div>

                      {r.comment && (
                        <p
                          className="mb-1"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {r.comment}
                        </p>
                      )}

                      {r.is_hidden && (
                        <span className="badge bg-secondary">Hidden</span>
                      )}

                      {(canHide || canDelete) && (
                        <div className="mt-2 d-flex gap-2">
                          {canHide && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleToggleHidden(r)}
                            >
                              {r.is_hidden ? "Unhide" : "Hide"}
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteReview(r)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
