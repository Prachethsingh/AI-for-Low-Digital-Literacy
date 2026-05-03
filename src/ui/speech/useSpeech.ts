import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Language } from "../../domain/i18n";

type UseSpeechParams = {
  lang: Language;
};

type SpeechApi = {
  supported: boolean;
  speaking: boolean;
  listening: boolean;
  transcript: string;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
};

type WebkitSpeechRecognition = new () => any;

function getRecognitionCtor(): WebkitSpeechRecognition | null {
  const w = window as unknown as {
    SpeechRecognition?: WebkitSpeechRecognition;
    webkitSpeechRecognition?: WebkitSpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeech({ lang }: UseSpeechParams): SpeechApi {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<any>(null);
  const supportsRecognition = useMemo(() => Boolean(getRecognitionCtor()), []);
  const supportsTts = useMemo(() => typeof window.speechSynthesis !== "undefined", []);

  const supported = supportsRecognition || supportsTts;

  const speak = useCallback(
    (text: string) => {
      if (!supportsTts) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === "kn" ? "kn-IN" : "en-IN";
      u.rate = 0.95;
      u.pitch = 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [lang, supportsTts]
  );

  const stopSpeaking = useCallback(() => {
    if (!supportsTts) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supportsTts]);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    const r = new Ctor();
    recognitionRef.current = r;
    r.lang = lang === "kn" ? "kn-IN" : "en-IN";
    r.interimResults = true;
    r.continuous = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (event: any) => {
      let combined = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        combined += event.results[i][0]?.transcript ?? "";
      }
      setTranscript(combined.trim());
    };

    setTranscript("");
    try {
      r.start();
    } catch {
      setListening(false);
    }
  }, [lang]);

  const stopListening = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.stop();
    } catch {
      // ignore
    }
    setListening(false);
  }, []);

  const clearTranscript = useCallback(() => setTranscript(""), []);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  return {
    supported,
    speaking,
    listening,
    transcript,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    clearTranscript
  };
}

