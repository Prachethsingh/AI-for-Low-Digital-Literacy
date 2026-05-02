import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Stack,
  alpha
} from "@mui/material";
import { Language as LanguageIcon, ArrowForward } from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";

export function LanguageScreen(props: {
  lang: Language;
  onSelect: (lang: Language) => void;
  onContinue: () => void;
}) {
  const { lang, onSelect, onContinue } = props;

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 6, mt: 4, textAlign: 'center' }}>
        <LanguageIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t(lang, "choose_language")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          English / ಕನ್ನಡ
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ flex: 1 }}>
        <Paper 
          component={Button}
          fullWidth
          onClick={() => onSelect("en")}
          sx={{ 
            p: 3, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            textTransform: 'none',
            borderRadius: 4,
            border: 2,
            borderColor: lang === "en" ? 'primary.main' : 'divider',
            bgcolor: lang === "en" ? alpha('#2e7d32', 0.05) : 'background.paper',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: alpha('#2e7d32', 0.08),
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: lang === "en" ? 'primary.main' : 'text.primary' }}>
            {t(lang, "english")}
          </Typography>
          <ArrowForward color={lang === "en" ? "primary" : "disabled"} />
        </Paper>

        <Paper 
          component={Button}
          fullWidth
          onClick={() => onSelect("kn")}
          sx={{ 
            p: 3, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            textTransform: 'none',
            borderRadius: 4,
            border: 2,
            borderColor: lang === "kn" ? 'primary.main' : 'divider',
            bgcolor: lang === "kn" ? alpha('#2e7d32', 0.05) : 'background.paper',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: alpha('#2e7d32', 0.08),
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: lang === "kn" ? 'primary.main' : 'text.primary' }}>
            {t(lang, "kannada")}
          </Typography>
          <ArrowForward color={lang === "kn" ? "primary" : "disabled"} />
        </Paper>
      </Stack>

      <Button 
        variant="contained" 
        size="large" 
        fullWidth 
        onClick={onContinue}
        sx={{ py: 2, borderRadius: 3, mb: 2 }}
      >
        {t(lang, "continue")}
      </Button>
    </Box>
  );
}

