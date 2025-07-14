'use client';

import { AppBar as MuiAppBar, Toolbar, Typography, Box } from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';

export function AppBar() {
  return (
    <MuiAppBar position="static" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FitnessCenter />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            Health Planet Dashboard
          </Typography>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}