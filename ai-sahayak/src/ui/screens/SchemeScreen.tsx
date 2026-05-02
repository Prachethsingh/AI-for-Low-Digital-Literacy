import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Stack,
  IconButton,
  alpha
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import type { Language } from "../../domain/i18n";
import { t } from "../../domain/i18n";
import type { SchemeId } from "../../domain/schemes";
import { schemes } from "../../domain/schemes";

export function SchemeScreen(props: {
  lang: Language;
  onPick: (id: SchemeId) => void;
  onBack: () => void;
}) {
  const { lang, onPick, onBack } = props;

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

      <Stack spacing={2} sx={{ flex: 1 }}>
        {schemes.map((s) => (
          <Paper 
            key={s.id}
            component={Button}
            fullWidth
            onClick={() => onPick(s.id)}
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
                {t(lang, s.titleKey as any)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t(lang, s.subtitleKey as any)}
              </Typography>
            </Box>
            <ArrowForward color="primary" />
          </Paper>
        ))}
      </Stack>

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

