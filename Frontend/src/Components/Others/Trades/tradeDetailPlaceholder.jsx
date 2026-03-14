import { Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function TradeDetailPlaceholder() {
  const { tradeId } = useParams();
  const navigate = useNavigate();

  return (
    <Paper className="rounded-panel border border-border bg-surface-card p-8" elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Trade Detail (In Progress)
        </Typography>
        <Typography color="text.secondary">
          Selected trade ID: <span className="font-semibold text-text-primary">{tradeId}</span>
        </Typography>
        <Typography color="text.secondary">
          This page will contain the full trade breakdown in the next story.
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/trades")} sx={{ alignSelf: "flex-start" }}>
          Back to Trade History
        </Button>
      </Stack>
    </Paper>
  );
}
