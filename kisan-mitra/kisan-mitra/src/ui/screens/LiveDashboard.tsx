import React, { useEffect, useState } from "react";

export default function LiveDashboard({ onBack }: { onBack: () => void }) {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchLocal = () => {
      try {
        const data = JSON.parse(localStorage.getItem("user_sessions") || "[]");
        setSessions(data.slice(0, 20));
      } catch (err) {
        console.error("Error reading localStorage", err);
      }
    };
    
    fetchLocal();

    // Poll for changes since localStorage events don't fire in the same window
    const interval = setInterval(fetchLocal, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen" style={{ background: "#1a1a1a", color: "#fff", padding: 20, overflowY: "auto" }}>
      <button className="back-btn" onClick={onBack} style={{ color: "#fff", borderColor: "#fff" }}>← Back</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ marginTop: 20, marginBottom: 20, color: "var(--leaf)" }}>Live Analytics (Local)</h2>
        <button 
          className="btn" 
          style={{ padding: "5px 10px", fontSize: 12, background: "var(--danger)", color: "#fff" }}
          onClick={() => { localStorage.clear(); setSessions([]); }}
        >
          Clear Data
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sessions.length === 0 ? <p>Waiting for real-time data...</p> : null}
        {sessions.map((s, i) => (
          <div key={s.id || i} style={{ background: "#2a2a2a", padding: 15, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>
              {new Date(s.created_at).toLocaleString()} • Lang: {s.language} • Scheme: {s.current_state}
            </div>
            <div>
              <strong>User:</strong> {s.query}
            </div>
            <div style={{ marginTop: 8, color: "var(--leaf)" }}>
              <strong>AI:</strong> {s.ai_response}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
