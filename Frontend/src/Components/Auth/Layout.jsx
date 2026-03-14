import { ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Box, Paper, Typography, Tabs, Tab } from "@mui/material";

export default function AuthLayout({ children, footer, tab = "login" }) {
  const tabValue = tab === "login" ? 0 : 1;

  return (
    <Box className="min-h-screen bg-surface-base px-4 py-6 sm:px-6 lg:px-8">
      <Box className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <Paper
          elevation={0}
          className="ui-card grid w-full max-w-4xl overflow-hidden lg:grid-cols-[1.05fr_1fr]"
        >
          <Box className="hidden border-r border-border bg-surface-muted p-8 lg:flex lg:flex-col lg:justify-between">
            <div>
              <Box className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-panel bg-brand-800 text-text-inverse">
                <ArrowUpRight size={20} />
              </Box>
              <Typography
                component="h1"
                className="text-page-title text-text-primary"
              >
                TradeLog
              </Typography>
              <Typography className="mt-2 max-w-sm text-body text-text-secondary">
                Track, review, and improve your trading performance with clean
                analytics built for serious traders.
              </Typography>
            </div>
            <Typography className="text-caption text-text-muted">
              Built for disciplined, data-driven trading decisions.
            </Typography>
          </Box>

          <Box className="bg-surface-card p-5 sm:p-7 lg:p-8">
            <Box className="mb-6 lg:hidden">
              <Box className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-panel bg-brand-800 text-text-inverse">
                <ArrowUpRight size={18} />
              </Box>
              <Typography
                component="h1"
                className="text-card-title text-text-primary"
              >
                TradeLog
              </Typography>
              <Typography className="mt-1 text-caption text-text-secondary">
                Your professional trading journal.
              </Typography>
            </Box>

            <Tabs
              value={tabValue}
              variant="fullWidth"
              className="mb-5 rounded-pill border border-border bg-surface-muted p-1"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                minHeight: 0,
                "& .MuiTabs-flexContainer": { gap: "0.25rem" },
              }}
            >
              <Tab
                component={NavLink}
                to="/login"
                label="Log In"
                className="!min-h-0 !rounded-pill !py-2 !text-caption !normal-case"
                sx={{
                  color: tabValue === 0 ? "#171A1C" : "#4A5158",
                  backgroundColor: tabValue === 0 ? "#FFFFFF" : "transparent",
                }}
              />
              <Tab
                component={NavLink}
                to="/register"
                label="Sign Up"
                className="!min-h-0 !rounded-pill !py-2 !text-caption !normal-case"
                sx={{
                  color: tabValue === 1 ? "#171A1C" : "#4A5158",
                  backgroundColor: tabValue === 1 ? "#FFFFFF" : "transparent",
                }}
              />
            </Tabs>

            {children}

            {footer && (
              <Typography className="mt-5 text-center text-caption text-text-secondary">
                {footer}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
