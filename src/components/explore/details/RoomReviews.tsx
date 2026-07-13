'use client'

import { useState, useRef, useLayoutEffect, FormEvent } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Space } from "@/types/space"; // adjust path to wherever your Space type lives

gsap.registerPlugin(ScrollTrigger);

export interface Review {
  _id: string;
  userName?: string;
  rating: number;
  comment: string;
}

interface ReviewPayload {
  rating: number;
  comment: string;
}

interface RoomReviewsProps {
  room: Space;
  reviews?: Review[];
  canReview: boolean;
  onSubmitReview?: (payload: ReviewPayload) => Promise<void>;
}

export default function RoomReviews({ room, reviews = [], canReview, onSubmitReview }: RoomReviewsProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".review-card", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: listRef.current, start: "top 85%" },
      });
    }, listRef);
    return () => ctx.revert();
  }, [reviews]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (room.rating ?? 0).toFixed(1);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitReview?.({ rating, comment }); // TODO: hook to backend
      setComment("");
      setRating(5);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-neutral-border pt-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-neutral-text">Reviews</h2>
        <span className="flex items-center gap-1 text-sm text-neutral-text/70">
          <StarIcon filled className="w-4 h-4 text-secondary" />
          {avgRating} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {canReview && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-neutral-border bg-white p-5">
          <p className="text-sm font-medium text-neutral-text mb-3">Leave a review</p>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button type="button" key={star} onClick={() => setRating(star)} aria-label={`Rate ${star} stars`}>
                <StarIcon filled={star <= rating} className="w-6 h-6 text-secondary" />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share how your visit went..."
            rows={3}
            className="w-full resize-none rounded-lg border border-neutral-border bg-neutral-bg p-3 text-sm text-neutral-text outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post review"}
          </button>
        </form>
      )}

      <div ref={listRef} className="space-y-4">
        {reviews.length === 0 && (
          <p className="text-sm text-center text-neutral-text/60">No reviews yet. Be the first to share your experience.</p>
        )}
        {reviews.map((r) => (
          <div key={r._id} className="review-card rounded-xl border border-neutral-border bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-neutral-text">{r.userName ?? "Guest"}</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} filled={s <= r.rating} className="w-4 h-4 text-secondary" />
                ))}
              </div>
            </div>
            <p className="text-sm text-neutral-text/80">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface StarIconProps {
  filled: boolean;
  className: string;
}

function StarIcon({ filled, className }: StarIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" className={className}>
      <path strokeWidth={1.5} strokeLinejoin="round" d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.2 6.1-.6L10 1.5z" />
    </svg>
  );
}