import React from "react";
import { 
  Box, 
  Button, 
  Stack,
  alpha
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";

export function YesNoStep(props: {
  lang: Language;
  value?: string | boolean;
  onPick: (v: boolean) => void;
}) {
  const { lang, onPick } = props;
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => onPick(true)}
        startIcon={<ThumbUp />}
        sx={{ 
          py: 3, 
          borderRadius: 4,
          borderColor: 'success.light',
          color: 'success.main',
          bgcolor: alpha('#2e7d32', 0.05),
          fontWeight: 800,
          '&:hover': {
            borderColor: 'success.main',
            bgcolor: alpha('#2e7d32', 0.1),
          }
        }}
      >
        {t(lang, "yes")}
      </Button>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => onPick(false)}
        startIcon={<ThumbDown />}
        sx={{ 
          py: 3, 
          borderRadius: 4,
          borderColor: 'error.light',
          color: 'error.main',
          bgcolor: alpha('#d32f2f', 0.05),
          fontWeight: 800,
          '&:hover': {
            borderColor: 'error.main',
            bgcolor: alpha('#d32f2f', 0.1),
          }
        }}
      >
        {t(lang, "no")}
      </Button>
    </Stack>
  );
}

