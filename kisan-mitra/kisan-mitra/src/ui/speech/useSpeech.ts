import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "../domain/schemes";

export type SpeechApi = {
  speaking: boolean;
  listening: boolean;
  transcript: string;
  speak: (text: string) => void;
  stop: () => void;
  startListening: () => void;
  clearTranscript: () => void;
  supported: boolean;
};

export function useSpeech(lang: Lang): SpeechApi {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<SpeechRecognition | null>(null);

  const ttsLang = lang === "kn" ? "kn-IN" : "en-IN";

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel?.();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = ttsLang;
      u.rate = 0.88;
      u.pitch = 1.05;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [ttsLang]
  );

  const startListening = useCallback(() => {
    const Ctor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!Ctor) return;
    if (recRef.current) {
      try { recRef.current.stop(); } catch {}
    }
    const r = new Ctor() as SpeechRecognition;
    recRef.current = r;
    r.lang = ttsLang;
    r.interimResults = true;
    r.continuous = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e: SpeechRecognitionEvent) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++)
        txt += e.results[i][0]?.transcript ?? "";
      setTranscript(txt.trim());
    };
    setTranscript("");
    try { r.start(); } catch { setListening(false); }
  }, [ttsLang]);

  const clearTranscript = useCallback(() => setTranscript(""), []);

  useEffect(() => () => {
    try { recRef.current?.stop(); } catch {}
    window.speechSynthesis?.cancel?.();
  }, []);

  const supported = typeof window !== "undefined" &&
    ("speechSynthesis" in window || "SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  return { speaking, listening, transcript, speak, stop, startListening, clearTranscript, supported };
}
