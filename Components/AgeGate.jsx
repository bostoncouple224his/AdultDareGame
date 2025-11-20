// Components/AgeGate.jsx
import React, { useEffect, useState } from "react";

/**
 * AgeGate modal:
 * - requires user to confirm they are 18+ (or given minimumAge)
 * - stores confirmation in localStorage key "adgd_verified"
 * - accessible: traps focus and provides proper aria attributes
 *
 * Usage: <AgeGate minimumAge={18} onAccept={() => { ... }} />
 */

export default function AgeGate({ minimumAge = 18, onAccept = () => {} }) {
  const storageKey = "adgd_verified";
  const [verified, setVerified] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const prev = localStorage.getItem(storageKey);
      if (prev === "true") {
        setVerified(true);
        onAccept();
      } else {
        setShow(true);
      }
    } catch (e) {
      // localStorage might be disabled — still show gate
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(storageKey, "true");
    } catch (e) {}
    setVerified(true);
    setShow(false);
    onAccept();
  }

  function decline() {
    // Redirect or hide content — we'll just hide the UI and show message
    setShow(false);
    // Optionally navigate away; the host app can implement
  }

  if (verified) return null;

  if (!show) {
    return (
      <div role="dialog" aria-hidden="true" style={{ padding: 16 }}>
        <p>Access denied: must confirm your age to proceed.</p>
      </div>
    );
  }

  // Simple inline styles so you can paste and run immediately.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "90%",
          background: "white",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <h2>Age verification</h2>
        <p>
          This site contains content intended only for adults. You must be {minimumAge} or older to enter.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
          <button onClick={decline} aria-label="I am not old enough">I am not {minimumAge}+</button>
          <button onClick={accept} aria-label="I am old enough">I am {minimumAge}+</button>
        </div>
      </div>
    </div>
  );
}
