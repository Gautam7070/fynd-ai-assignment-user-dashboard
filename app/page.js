"use client";
import { useState } from "react";

export default function UserDashboard() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (rating === 0) {
      setStatus("Please select a rating");
      return;
    }

    setLoading(true);
    setStatus("Analyzing with AI...");
    setResponse("");

    try {
      const backendUrl = `https://fynd-ai-assignment-0y2z.onrender.com/submit-review`;
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submission failed");

      setResponse(data.ai_response);
      setStatus("Success! Check the AI reply below.");
    } catch (err) {
      setStatus("Submission error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.background}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Customer Insights</h1>
          <p style={styles.subtitle}>Your feedback powers our AI-driven customer insights.</p>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>How was your experience?</label>
          <div style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                style={{
                  ...styles.starButton,
                  color: (hover || rating) >= star ? "#fbbf24" : "#e5e7eb",
                }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && <span style={styles.ratingText}>{rating}/5 Stars</span>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tell us more</label>
          <textarea
            style={styles.textarea}
            rows={5}
            placeholder="What did you like or dislike?"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <button
          style={{
            ...styles.button,
            opacity: !review.trim() || rating === 0 || loading ? 0.6 : 1,
            cursor: !review.trim() || rating === 0 || loading ? "not-allowed" : "pointer"
          }}
          onClick={submitReview}
          disabled={!review.trim() || rating === 0 || loading}
        >
          {loading ? "Processing..." : "Submit Feedback"}
        </button>

        {status && (
          <div style={{
            ...styles.status,
            color: status.includes("Success") ? "#10b981" : status.includes("error") ? "#ef4444" : "#6366f1"
          }}>
            {status}
          </div>
        )}

        {response && (
          <div style={styles.responseBox}>
            <div style={styles.responseIcon}>🤖</div>
            <div style={styles.responseContent}>
              <h3 style={styles.responseTitle}>AI Response</h3>
              <p style={styles.responseText}>{response}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: "20px",
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: "hidden",
    backgroundColor: "#0f172a",
  },
  background: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "120%",
    height: "120%",
    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)",
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "480px",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    color: "#94a3b8",
    margin: 0,
    fontSize: "16px"
  },
  inputGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.5px"
  },
  starContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },
  starButton: {
    background: "none",
    border: "none",
    fontSize: "36px",
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
    transition: "transform 0.2s, color 0.2s",
  },
  ratingText: {
    fontSize: "12px",
    color: "#6366f1",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  textarea: {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    resize: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    marginTop: "8px",
    padding: "16px",
    borderRadius: "16px",
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    fontWeight: "700",
    transition: "all 0.2s",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
  },
  status: {
    marginTop: "16px",
    fontSize: "14px",
    textAlign: "center",
    fontWeight: "500",
  },
  responseBox: {
    marginTop: "32px",
    padding: "20px",
    background: "rgba(99, 102, 241, 0.1)",
    borderRadius: "20px",
    border: "1px solid rgba(99,102,241,0.2)",
    display: "flex",
    gap: "16px",
    animation: "slideUp 0.4s ease-out",
  },
  responseIcon: {
    fontSize: "24px",
  },
  responseContent: {
    flex: 1,
  },
  responseTitle: {
    margin: "0 0 6px 0",
    fontSize: "14px",
    color: "#818cf8",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  responseText: {
    margin: 0,
    fontSize: "15px",
    color: "#e2e8f0",
    lineHeight: "1.6"
  },
};
