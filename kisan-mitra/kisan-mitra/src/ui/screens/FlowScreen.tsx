import React, { useEffect, useState, useRef } from "react";
import type { Answers } from "../App";
import type { Lang, Scheme } from "../../domain/schemes";
import type { SpeechApi } from "../speech/useSpeech";

export default function FlowScreen({
  lang, scheme, speech, initialAnswers, onBack, onDone,
}: {
  lang: Lang; scheme: Scheme; speech: SpeechApi;
  initialAnswers: Answers; onBack: () => void;
  onDone: (a: Answers) => void;
}) {
  const kn = lang === "kn";
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [camStatus, setCamStatus] = useState<"idle" | "ready" | "blocked">("idle");
  const streamRef = useRef<MediaStream | null>(null);

  const questions = scheme.questions;
  const total = questions.length;
  const q = questions[idx];
  const progress = Math.round((idx / total) * 100);

  useEffect(() => {
    if (q) speech.speak(kn ? q.kn : q.en);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [idx, lang]);

  const setAns = (key: string, val: string | boolean) =>
    setAnswers((p) => ({ ...p, [key]: val }));

  const next = (key: string, val: string | boolean) => {
    setAns(key, val);
    if (idx < total - 1) setIdx((i) => i + 1);
    else onDone({ ...answers, [key]: val });
  };

  const openCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play(); }
      setCamStatus("ready");
    } catch { setCamStatus("blocked"); }
  };

  const capture = () => {
    const v = videoRef.current; const c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth || 720; c.height = v.videoHeight || 960;
    c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL("image/jpeg", 0.88);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCamStatus("idle");
    next(q.id, dataUrl);
  };

  if (!q) return null;

  return (
    <div className="screen">
      {/* Back + progress */}
      <div className="back-row">
        <button className="back-btn" onClick={idx > 0 ? () => setIdx((i) => i - 1) : onBack}>
          ← {kn ? "ಹಿಂದೆ" : "Back"}
        </button>
      </div>

      <div className="progress-wrap">
        <div className="step-badge">{idx + 1}</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--mud)" }}>{idx + 1}/{total}</span>
      </div>

      {/* Scheme name pill */}
      <div style={{ display: "flex" }}>
        <span style={{
          background: scheme.bg, border: `1.5px solid ${scheme.color}`, color: scheme.color,
          borderRadius: 999, padding: "5px 14px", fontWeight: 800, fontSize: 13,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          {scheme.icon} {kn ? scheme.kn : scheme.en}
        </span>
      </div>

      {/* Question */}
      <div className="question-card" key={q.id}>
        <div className="q-icon">
          {q.type.kind === "camera"
            ? (q.type.purpose === "aadhaar" ? "🪪" : q.type.purpose === "crop" ? "🌾" : "📄")
            : "❓"}
        </div>
        <div className="q-text">{kn ? q.kn : q.en}</div>
      </div>

      {/* Yes / No */}
      {q.type.kind === "yes_no" && (
        <div className="yn-row">
          <button className="yn-btn yn-yes" onClick={() => next(q.id, true)}>
            👍 {kn ? "ಹೌದು" : "Yes"}
          </button>
          <button className="yn-btn yn-no" onClick={() => next(q.id, false)}>
            👎 {kn ? "ಇಲ್ಲ" : "No"}
          </button>
        </div>
      )}

      {/* Choice */}
      {q.type.kind === "choice" && (
        <div className="choice-grid">
          {q.type.options.map((o) => (
            <button key={o.id} className="choice-btn" onClick={() => next(q.id, o.id)}>
              <span className="choice-icon">{o.icon}</span>
              <span>{kn ? o.kn : o.en}</span>
            </button>
          ))}
        </div>
      )}

      {/* Camera */}
      {q.type.kind === "camera" && (
        <div>
          {camStatus === "idle" && (
            <div className="stack">
              <button className="btn btn-terra" onClick={openCam}>📷 {kn ? "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ" : "Open Camera"}</button>
              <button className="btn btn-ghost" onClick={() => next(q.id, "skipped")}>
                {kn ? "ಬಿಟ್ಟುಬಿಡಿ (ಐಚ್ಛಿಕ)" : "Skip (optional)"}
              </button>
            </div>
          )}
          {camStatus === "ready" && (
            <>
              <div className="cam-wrap">
                <video ref={videoRef} className="cam-video" playsInline muted />
                <div className="cam-overlay"><div className="cam-frame" /></div>
              </div>
              <div className="stack mt12">
                <button className="btn btn-terra" onClick={capture}>⭕ {kn ? "ಸೆರೆಹಿಡಿ" : "Capture"}</button>
                <button className="btn btn-ghost" onClick={() => { streamRef.current?.getTracks().forEach((t) => t.stop()); setCamStatus("idle"); }}>
                  {kn ? "ರದ್ದು" : "Cancel"}
                </button>
              </div>
            </>
          )}
          {camStatus === "blocked" && (
            <div className="notice">{kn ? "ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ" : "Camera permission denied"}</div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

      {/* Listen */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="listen-btn" onClick={() => speech.speak(kn ? q.kn : q.en)}>
          🔊 {kn ? "ಮತ್ತೆ ಕೇಳಿ" : "Listen again"}
        </button>
      </div>
    </div>
  );
}
