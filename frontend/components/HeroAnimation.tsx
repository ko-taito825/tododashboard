"use client";

/**
 * Pixel-art character animations overlaid on the hero background image.
 *
 * Positions are expressed as percentages of the hero container
 * (1456 × 280 px at the design viewport).
 *
 * Character regions in the 1568 × 260 px source image:
 *   Study Zone  : x  0-13%  →  left ~4-9%   of display
 *   Workout Zone: x 33-52%  →  left ~33-52%  of display
 *   Bar Zone    : x 68-100% →  left ~68-100% of display
 */

function Dumbbell() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, imageRendering: "pixelated" }}>
      {/* left weight */}
      <div style={{ width: 8, height: 18, background: "#6A6A7C" }} />
      {/* bar */}
      <div style={{ width: 26, height: 5, background: "#9090A2", marginTop: 6 }} />
      {/* right weight */}
      <div style={{ width: 8, height: 18, background: "#6A6A7C" }} />
    </div>
  );
}

function Cup() {
  return (
    <div style={{ imageRendering: "pixelated" }}>
      {/* rim */}
      <div style={{ width: 12, height: 3, background: "#B0B0C8", marginBottom: 1 }} />
      {/* body (trapezoid via clip-path) */}
      <div style={{
        width: 10, height: 13,
        background: "#C4C4DC",
        clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
        margin: "0 auto",
      }} />
      {/* base */}
      <div style={{ width: 14, height: 3, background: "#9090A8", margin: "0 auto" }} />
    </div>
  );
}

export default function HeroAnimation() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Study Zone: typing hands ─────────────────────────────
          Character sits at desk in the leftmost zone (~5–9% of width).
          Keyboard is at roughly y = 73–78% of the 280 px hero height.
      ── */}
      <div
        style={{
          position: "absolute",
          left: "6.2%",
          top: "74%",
          display: "flex",
          gap: 9,
        }}
      >
        <div className="px-hand-l" />
        <div className="px-hand-r" />
      </div>

      {/* ── Workout Zone: dumbbell curl ───────────────────────────
          Character holds dumbbell curled up at ~43% width, ~22% height.
      ── */}
      <div
        className="px-dumbbell"
        style={{ position: "absolute", left: "43%", top: "21%" }}
      >
        <Dumbbell />
      </div>

      {/* ── Bar Zone: bartender arm extending ────────────────────
          Bartender stands at ~83% width, serving counter at ~64% height.
          Arm extends to the LEFT (toward seated customer at ~73%).
      ── */}
      <div
        className="px-serve"
        style={{ position: "absolute", left: "79%", top: "64%" }}
      >
        {/* arm */}
        <div style={{ width: 22, height: 5, background: "#C48C5E", imageRendering: "pixelated" }} />
      </div>

      {/* ── Bar Zone: customer cup raising ───────────────────────
          Customer sits at ~73% width. Cup starts at counter level (~65% height).
          Animation starts 0.9 s after serve to create the "receive → drink" feel.
      ── */}
      <div
        className="px-cup"
        style={{ position: "absolute", left: "73.5%", top: "63%" }}
      >
        <Cup />
      </div>
    </div>
  );
}
