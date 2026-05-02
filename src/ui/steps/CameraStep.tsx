import React, { useEffect, useMemo, useRef, useState } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Stack,
  CircularProgress,
  IconButton,
  alpha
} from "@mui/material";
import { 
  CameraAlt, 
  RadioButtonChecked, 
  FlipCameraIos,
  Close,
  Warning
} from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";

type Purpose = "aadhaar" | "crop_damage";

function purposeLabel(purpose: Purpose): string {
  return purpose === "aadhaar" ? "Aadhaar" : "Crop damage";
}

export function CameraStep(props: {
  lang: Language;
  purpose: Purpose;
  onCaptured: (dataUrl: string) => void;
}) {
  const { lang, purpose, onCaptured } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "ready" | "blocked">("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);

  const canCamera = useMemo(() => Boolean(navigator.mediaDevices?.getUserMedia), []);

  useEffect(() => {
    return () => {
      stream?.getTracks?.().forEach((t) => t.stop());
    };
  }, [stream]);

  const start = async () => {
    if (!canCamera) {
      setStatus("blocked");
      return;
    }
    setStatus("starting");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      setStream(s);
      const v = videoRef.current;
      if (v) {
        v.srcObject = s;
        await v.play();
      }
      setStatus("ready");
    } catch {
      setStatus("blocked");
    }
  };

  const capture = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    const w = v.videoWidth || 720;
    const h = v.videoHeight || 1280;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    const dataUrl = c.toDataURL("image/jpeg", 0.9);
    onCaptured(dataUrl);
  };

  const stop = () => {
    stream?.getTracks?.().forEach((t) => t.stop());
    setStream(null);
    setStatus("idle");
  };

  return (
    <Box sx={{ mt: 2 }}>
      {status === "idle" && (
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<CameraAlt />}
          onClick={start}
          sx={{ py: 3, borderRadius: 4 }}
        >
          {t(lang, "camera_open")}
        </Button>
      )}

      {(status === "starting" || status === "ready") && (
        <Stack spacing={2}>
          <Paper 
            sx={{ 
              position: 'relative', 
              aspectRatio: '9/16', 
              bgcolor: 'black', 
              borderRadius: 6, 
              overflow: 'hidden',
              border: 4,
              borderColor: 'divider'
            }}
          >
            <video 
              ref={videoRef} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              playsInline 
              muted 
            />
            
            {/* Overlay */}
            <Box sx={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <Box sx={{ 
                width: '80%', 
                height: '40%', 
                border: 2, 
                borderColor: 'white', 
                borderRadius: 4,
                boxShadow: '0 0 0 999px rgba(0,0,0,0.5)'
              }} />
              <Typography variant="caption" sx={{ color: 'white', mt: 2, fontWeight: 700 }}>
                {purposeLabel(purpose).toUpperCase()} SCANNER
              </Typography>
            </Box>

            {status === "starting" && (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.7)' }}>
                <CircularProgress color="primary" />
              </Box>
            )}

            <IconButton 
              onClick={stop}
              sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
            >
              <Close />
            </IconButton>
          </Paper>

          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            disabled={status !== "ready"}
            startIcon={<RadioButtonChecked sx={{ fontSize: 40 }} />}
            onClick={capture}
            sx={{ py: 2, borderRadius: 4, bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
          >
            {t(lang, "capture")}
          </Button>
          
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </Stack>
      )}

      {status === "blocked" && (
        <Paper sx={{ p: 2, bgcolor: alpha('#d32f2f', 0.05), border: 1, borderColor: 'error.light', borderRadius: 4 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Warning color="error" />
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
              {t(lang, "camera_permission_needed")} ({purposeLabel(purpose)})
            </Typography>
          </Stack>
          <Button variant="outlined" color="error" fullWidth sx={{ mt: 2 }} onClick={start}>
            Retry
          </Button>
        </Paper>
      )}
    </Box>
  );
}

