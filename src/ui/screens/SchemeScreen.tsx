import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Stack,
  alpha,
  CircularProgress
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";
import type { SchemeId } from "../../domain/schemes";

export function SchemeScreen(props: {
  lang: Language;
  onPick: (id: SchemeId) => void;
  onBack: () => void;
}) {
  const { lang, onPick, onBack } = props;
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/schemes")
      .then((res) => res.json())
      .then((data) => {
        setSchemes(data.schemes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch schemes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
          {t(lang, "choose_scheme")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(lang, "scheme_hint")}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
          {schemes.map((s) => (
            <Paper 
              key={s.id}
              component={Button}
              fullWidth
              onClick={() => onPick(s.id as SchemeId)}
              sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                textTransform: 'none',
                borderRadius: 4,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                textAlign: 'left',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha('#2e7d32', 0.05),
                }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {lang === 'kn' ? s.name_kn : s.name_en}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {lang === 'kn' ? s.tagline_kn : s.tagline_en}
                </Typography>
              </Box>
              <ArrowForward color="primary" />
            </Paper>
          ))}
        </Stack>
      )}

      <Button 
        variant="text" 
        startIcon={<ArrowBack />} 
        onClick={onBack}
        sx={{ mt: 2, alignSelf: 'flex-start' }}
      >
        {t(lang, "back")}
      </Button>
    </Box>
  );
}

