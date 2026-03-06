import { Box, Paper, Typography } from "@mui/material";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} align="center">
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            mt={1}
          >
            {subtitle}
          </Typography>
        )}

        <Box mt={4}>{children}</Box>

        {footer && (
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mt={3}
          >
            {footer}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
