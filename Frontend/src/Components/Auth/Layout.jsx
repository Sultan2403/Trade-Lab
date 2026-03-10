import { ArrowUpRight } from "lucide-react";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function AuthLayout({ children, footer, tab = "login" }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 680,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          border: "1px solid #d5dce3",
          backgroundColor: "#f8f9fb",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={3.5}>
          <Box
            sx={{
              width: 74,
              height: 74,
              borderRadius: 2,
              bgcolor: "#0f5c6d",
              display: "grid",
              placeItems: "center",
            }}
          >
            <ArrowUpRight size={32} color="#ffffff" />
          </Box>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 2, fontSize: { xs: "2rem", sm: "2.6rem" } }}>
            TradeLog
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, fontSize: { xs: "1rem", sm: "1.08rem" } }}>
            Your professional trading journal
          </Typography>
        </Box>

        <Tabs value={tab === "login" ? 0 : 1} variant="fullWidth" sx={{ mb: 2.5 }}>
          <Tab
            component={NavLink}
            to="/login"
            label="Log In"
            sx={{ textTransform: "none", fontSize: "1.1rem", minHeight: 56 }}
          />
          <Tab
            component={NavLink}
            to="/register"
            label="Sign Up"
            sx={{ textTransform: "none", fontSize: "1.1rem", minHeight: 56 }}
          />
        </Tabs>

        <Box>{children}</Box>

        {footer && (
          <Typography align="center" color="text.secondary" mt={3.5} sx={{ fontSize: "1rem" }}>
            {footer}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
