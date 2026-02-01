"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function HomePage() {
  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      {/* ------------------------------------------------------------------
       * Hero / Welcome
       * ---------------------------------------------------------------- */}
      <Card
        sx={{
          mb: 6,
          backgroundColor: apple.secondarySystemBackground,
          border: `1px solid ${apple.separator}`,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h4" sx={{ color: omni.textPrimary, mb: 1 }}>
            Willkommen bei Omnixys
          </Typography>

          <Typography variant="body1" sx={{ color: omni.textSecondary }}>
            Dein modulares Control Center für Events, Services und Innovation.
          </Typography>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------
       * Quick Actions
       * ---------------------------------------------------------------- */}
      <Grid container spacing={3}>
        {[
          { title: "Dashboard", description: "KPIs & Analytics" },
          { title: "Events", description: "Erstellen & verwalten" },
          { title: "Tickets", description: "QR & Zugangskontrolle" },
          { title: "Admin", description: "User & Systeme" },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: apple.systemBackground,
                border: `1px solid ${apple.separator}`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: omni.textPrimary, mb: 0.5 }}
                >
                  {item.title}
                </Typography>

                <Typography variant="body2" sx={{ color: omni.textSecondary }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ------------------------------------------------------------------
       * Modules Overview (placeholder)
       * ---------------------------------------------------------------- */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ color: omni.textPrimary, mb: 2 }}>
          Module
        </Typography>

        <Card
          sx={{
            backgroundColor: apple.tertiarySystemBackground,
            border: `1px solid ${apple.separator}`,
          }}
        >
          <CardContent>
            <Typography variant="body2" sx={{ color: omni.textSecondary }}>
              Omnixys Events · Omnixys Flow · Omnixys Cloud · Omnixys One
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
