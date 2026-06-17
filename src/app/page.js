// src/app/page.js
"use client";

import { useState } from "react";

const SERVICES = ["Netflix", "HBO Max", "Disney+", "Hulu", "Apple TV+", "Amazon Prime", "Peacock", "Paramount+"];
const GENRES = ["Drama", "Comedy", "Thriller", "Sci-Fi", "Fantasy", "Crime", "Reality TV", "Documentary", "Horror", "Romance", "Action", "Animated"];
const MOODS = [
  { label: "Binge-worthy", val: "something intense to binge" },
  { label: "Light & easy", val: "light and easy to watch" },
  { label: "Thought-provoking", val: "thought-provoking and deep" },
  { label: "Make me laugh", val: "funny and makes me laugh" },
  { label: "Edge of seat", val: "keeps me on the edge of my seat" },
  { label: "Short episodes", val: "something short with 30 min episodes" },
];

const LOADING_MSGS = [
  "Scanning your streaming services...",
  "Matching your taste profile...",
  "Hunting down hidden gems...",
  "Almost ready...",
];

const S = {
  page: { minHeight: "100vh", background: "#f9fafb", fontFamily: "inherit" },
  wrap: { maxWidth: 600, margin: "0 auto", padding: "2rem 1rem 4rem" },
  logoRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  logoIcon: { width: 32, height: 32, borderRadius: 8, background: "#7F77DD", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 },
  logoName: { fontSize: 18, fontWeight: 500, color: "#111" },
  sub: { fontSize: 13, color: "#999", margin: "0 0 2rem" },
  section: { marginBottom: "1.5rem" },
  label: { fontSize: 12, color: "#999", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 },
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "7px 14px", borderRadius: 20, border: "1px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#555", cursor: "pointer", transition: "all 0.15s", userSelect: "none" },
  chipSelected: { background: "#EEEDFE", borderColor: "#534AB7", color: "#3C3489", fontWeight: 500 },
  btn: { background: "#7F77DD", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 15, fontWeight: 500, cursor: "pointer", width: "100%", marginTop: 4, fontFamily: "inherit" },
  btnDisabled: { background: "#e5e7eb", color: "#aaa", cursor: "default" },
  error: { color: "#A32D2D", fontSize: 13, marginTop: 8 },
  loading: { textAlign: "center", padding: "4rem 1rem" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem", marginBottom: 12 },
  pickNum: { fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  showTitle: { fontSize: 16, fontWeight: 500, color: "#111", margin: 0 },
  matchScore: { fontSize: 13, fontWeight: 500, color: "#534AB7", flexShrink: 0, marginLeft: 12 },
  meta: { fontSize: 12, color: "#999", display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 },
  hook: { fontSize: 14, color: "#333", lineHeight: 1.6, margin: "0 0 6px" },
  why: { fontSize: 13, color: "#888", lineHeight: 1.5, margin: "0 0 10px" },
  badges: { display: "flex", gap: 6, flexWrap: "wrap" },
  badgePlatform: { fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#EEEDFE", color: "#3C3489", fontWeight: 500 },
  badgeGenre: { fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#f3f4f6", color: "#555" },
  resetBtn: { background: "none", border: "none", color: "#aaa", fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" },
};

const PICK_LABELS = ["Top pick", "Also great", "Worth watching", "Hidden gem"];

export default function Home() {
  const [services, setServices] = useState([]);
  const [genres, setGenres] = useState([]);
  const [mood, setMood] = useState("");
  const [stage, setStage] = useState("form");
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0]);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");

  const toggleItem = (val, arr, setArr) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const find = async () => {
    setError("");
    setStage("loading");
    let idx = 0;
    const iv = setInterval(() => {
      idx = (idx + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[idx]);
    }, 1800);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services, genres, mood }),
      });
      const data = await res.json();
      clearInterval(iv);
      if (!res.ok) throw new Error(data.error || "Failed");
      setShows(data.shows);
      setStage("results");
    } catch (e) {
      clearInterval(iv);
      setError(e.message || "Something went wrong. Please try again.");
      setStage("form");
    }
  };

  const reset = () => {
    setServices([]); setGenres([]); setMood("");
    setShows([]); setError(""); setStage("form");
  };

  const canSubmit = services.length > 0 && genres.length > 0;

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.logoRow}>
          <div style={S.logoIcon}>▶</div>
          <span style={S.logoName}>WatchNext</span>
        </div>
        <p style={S.sub}>Find your next show in seconds</p>

        {stage === "form" && (
          <div>
            <div style={S.section}>
              <div style={S.label}>Your streaming services</div>
              <div style={S.chips}>
                {SERVICES.map(s => (
                  <div key={s} style={{ ...S.chip, ...(services.includes(s) ? S.chipSelected : {}) }}
                    onClick={() => toggleItem(s, services, setServices)}>{s}</div>
                ))}
              </div>
            </div>

            <div style={S.section}>
              <div style={S.label}>Genres you love</div>
              <div style={S.chips}>
                {GENRES.map(g => (
                  <div key={g} style={{ ...S.chip, ...(genres.includes(g) ? S.chipSelected : {}) }}
                    onClick={() => toggleItem(g, genres, setGenres)}>{g}</div>
                ))}
              </div>
            </div>

            <div style={S.section}>
              <div style={S.label}>What's your mood?</div>
              <div style={S.chips}>
                {MOODS.map(m => (
                  <div key={m.val} style={{ ...S.chip, ...(mood === m.val ? S.chipSelected : {}) }}
                    onClick={() => setMood(mood === m.val ? "" : m.val)}>{m.label}</div>
                ))}
              </div>
            </div>

            <button
              style={canSubmit ? S.btn : { ...S.btn, ...S.btnDisabled }}
              onClick={find}
              disabled={!canSubmit}
            >
              Find my next show →
            </button>
            {error && <p style={S.error}>{error}</p>}
          </div>
        )}

        {stage === "loading" && (
          <div style={S.loading}>
            <div style={{ fontSize: 32, color: "#7F77DD" }}>▶</div>
            <p style={{ color: "#888", fontSize: 15, marginTop: "1rem" }}>{loadingMsg}</p>
          </div>
        )}

        {stage === "results" && (
          <div>
            <p style={{ fontSize: 13, color: "#999", margin: "0 0 1rem" }}>
              Based on your services and taste — here's what to watch next:
            </p>
            {shows.map((s, i) => (
              <div key={i} style={S.card}>
                <div style={S.pickNum}>{PICK_LABELS[i] || `Pick ${i + 1}`}</div>
                <div style={S.titleRow}>
                  <h2 style={S.showTitle}>{s.title}</h2>
                  <span style={S.matchScore}>{Math.round(s.matchScore)}% match</span>
                </div>
                <div style={S.meta}>
                  <span>{s.year}</span>
                  <span>{s.seasons}</span>
                </div>
                <p style={S.hook}>{s.hook}</p>
                <p style={S.why}>{s.why}</p>
                <div style={S.badges}>
                  <span style={S.badgePlatform}>{s.platform}</span>
                  <span style={S.badgeGenre}>{s.genre}</span>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button style={S.resetBtn} onClick={reset}>Start over</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
