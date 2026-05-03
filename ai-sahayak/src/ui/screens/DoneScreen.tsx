import React, { useMemo, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Stack,
  alpha,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { 
  CheckCircle, 
  Download, 
  FileUpload, 
  Home,
  DoneAll
} from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";
import type { Scheme } from "../../domain/schemes";

function downloadTextFile(filename: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

export function DoneScreen(props: { lang: Language; scheme: Scheme; onHome: () => void }) {
  const { lang, scheme, onHome } = props;
  const [download, setDownload] = useState(true);
  const [submit, setSubmit] = useState(false);

  const canContinue = download || submit;
  const schemeName = useMemo(() => t(lang, scheme.titleKey as any), [lang, scheme.titleKey]);

  const handleFinalAction = () => {
    if (download) {
      downloadTextFile(
        "application.txt",
        `Application ready for: ${schemeName}\n\n(Replace with real PDF generation in your final build.)`
      );
    }
    if (submit) {
      alert("Submitted! (Demo)");
    }
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ mb: 4, mt: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t(lang, "ready_title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(lang, "ready_subtitle")}
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', p: 2, mb: 4, borderRadius: 4, border: 1, borderColor: 'divider' }}>
        <Stack spacing={1}>
          <FormControlLabel
            control={<Checkbox checked={download} onChange={(e) => setDownload(e.target.checked)} color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Download fontSize="small" />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{t(lang, "download_pdf")}</Typography>
              </Box>
            }
          />
          <FormControlLabel
            control={<Checkbox checked={submit} onChange={(e) => setSubmit(e.target.checked)} color="primary" />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileUpload fontSize="small" />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{t(lang, "submit")}</Typography>
              </Box>
            }
          />
        </Stack>
      </Paper>

      <Stack spacing={2} sx={{ width: '100%', mt: 'auto' }}>
        <Button 
          variant="contained" 
          size="large" 
          fullWidth 
          disabled={!canContinue}
          startIcon={<DoneAll />}
          onClick={handleFinalAction}
          sx={{ py: 2, borderRadius: 3 }}
        >
          {download && submit ? t(lang, "download_submit") : download ? t(lang, "download_pdf") : t(lang, "submit")}
        </Button>
        
        <Button 
          variant="text" 
          size="large" 
          fullWidth 
          startIcon={<Home />}
          onClick={onHome}
          sx={{ py: 1.5, borderRadius: 3 }}
        >
          {t(lang, "go_home")}
        </Button>
      </Stack>
    </Box>
  );
}

