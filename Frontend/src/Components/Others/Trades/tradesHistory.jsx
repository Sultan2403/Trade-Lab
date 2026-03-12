import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTrades from "../../../Hooks/useTrades";

const sortOptions = [
  { value: "openedAt-desc", label: "Date (Newest)" },
  { value: "openedAt-asc", label: "Date (Oldest)" },
  { value: "pair-asc", label: "Instrument (A-Z)" },
  { value: "pair-desc", label: "Instrument (Z-A)" },
  { value: "pnl-desc", label: "P&L (High to Low)" },
  { value: "pnl-asc", label: "P&L (Low to High)" },
];

const statusOptions = ["All", "Open", "Closed"];
const directionOptions = ["All", "Long", "Short"];
const limitOptions = [10, 20, 50];

const formatPrice = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const calcPnl = (trade) => {
  if (trade.exit_price === null || trade.exit_price === undefined) return null;
  const directionSign = trade.direction === "Short" ? -1 : 1;
  return (Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.positionSize) * directionSign;
};

const calcRMultiple = (trade, pnl) => {
  if (trade.rMultiple !== undefined && trade.rMultiple !== null) return Number(trade.rMultiple);

  const riskPerUnit = Math.abs(Number(trade.entry_price) - Number(trade.stopLoss));
  const riskAmount = riskPerUnit * Number(trade.positionSize);

  if (!riskAmount || Number.isNaN(riskAmount) || pnl === null || Number.isNaN(pnl)) return null;

  return pnl / riskAmount;
};

const getOutcome = (trade, pnl) => {
  if (trade.status === "Open") return "Open";
  if (pnl === null || Number.isNaN(pnl)) return "Closed";
  if (pnl > 0) return "Win";
  if (pnl < 0) return "Loss";
  return "Breakeven";
};

export default function TradesHistory() {
  const navigate = useNavigate();
  const { data, loading, error, getTrades } = useTrades();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("openedAt-desc");
  const [statusFilter, setStatusFilter] = useState("All");
  const [directionFilter, setDirectionFilter] = useState("All");

  useEffect(() => {
    getTrades({ page, limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const pagination = data?.trades?.pagination;

  const rows = useMemo(() => {
    const list = data?.trades?.trades ?? [];

    const filtered = list
      .filter((trade) => {
        const matchesSearch = [trade.pair, trade.notes].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(search.toLowerCase().trim()),
        );

        const matchesStatus = statusFilter === "All" || trade.status === statusFilter;
        const matchesDirection = directionFilter === "All" || trade.direction === directionFilter;

        return matchesSearch && matchesStatus && matchesDirection;
      })
      .map((trade) => {
        const pnl = calcPnl(trade);
        const rMultiple = calcRMultiple(trade, pnl);

        return {
          ...trade,
          pnl,
          rMultiple,
          outcome: getOutcome(trade, pnl),
        };
      });

    const [field, order] = sortBy.split("-");
    const directionSign = order === "asc" ? 1 : -1;

    filtered.sort((a, b) => {
      if (field === "pair") return a.pair.localeCompare(b.pair) * directionSign;
      if (field === "pnl") return ((a.pnl ?? Number.NEGATIVE_INFINITY) - (b.pnl ?? Number.NEGATIVE_INFINITY)) * directionSign;
      return (new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime()) * directionSign;
    });

    return filtered;
  }, [data?.trades?.trades, directionFilter, search, sortBy, statusFilter]);

  return (
    <Paper className="rounded-panel border border-border bg-surface-card p-6" elevation={0}>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by instrument or notes..."
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="sort-select">Sort By</InputLabel>
            <Select
              labelId="sort-select"
              label="Sort By"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel id="status-select">Status</InputLabel>
            <Select
              labelId="status-select"
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="direction-select">Direction</InputLabel>
            <Select
              labelId="direction-select"
              label="Direction"
              value={directionFilter}
              onChange={(event) => setDirectionFilter(event.target.value)}
            >
              {directionOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {error && <Alert severity="error">Unable to load trades right now.</Alert>}

        <TableContainer sx={{ border: "1px solid", borderColor: "#D0D5DD", borderRadius: "12px" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F3F4F6" }}>
                {["Date", "Instrument", "Direction", "Entry", "Exit", "Position Size", "P&L", "R-Multiple", "Outcome"].map((head) => (
                  <TableCell key={head} sx={{ fontWeight: 700 }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">No trades found for selected filters.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((trade) => (
                  <TableRow
                    key={trade._id}
                    hover
                    onClick={() => navigate(`/trades/${trade._id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{formatDate(trade.openedAt)}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{trade.pair}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        {trade.direction === "Long" ? (
                          <ArrowUp size={14} className="text-green-600" />
                        ) : (
                          <ArrowDown size={14} className="text-red-600" />
                        )}
                        {trade.direction}
                      </span>
                    </TableCell>
                    <TableCell>{formatPrice(trade.entry_price)}</TableCell>
                    <TableCell>{formatPrice(trade.exit_price)}</TableCell>
                    <TableCell>{trade.positionSize ?? "--"}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          trade.pnl === null ? "text.secondary" : trade.pnl >= 0 ? "#067647" : "#B42318",
                        fontWeight: trade.pnl === null ? 400 : 700,
                      }}
                    >
                      {trade.pnl === null ? "--" : formatPrice(trade.pnl)}
                    </TableCell>
                    <TableCell>{trade.rMultiple === null ? "--" : trade.rMultiple.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={trade.outcome}
                        color={trade.outcome === "Win" ? "success" : trade.outcome === "Loss" ? "error" : "default"}
                        variant={trade.outcome === "Open" || trade.outcome === "Breakeven" ? "outlined" : "filled"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
          <Typography color="text.secondary">
            Showing page {pagination?.page ?? page} of {pagination?.pages ?? 1} ({pagination?.total ?? 0} total trades)
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="rows-select">Rows</InputLabel>
              <Select
                labelId="rows-select"
                label="Rows"
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
              >
                {limitOptions.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Pagination
              count={Math.max(pagination?.pages ?? 1, 1)}
              page={page}
              onChange={(_, next) => setPage(next)}
              color="primary"
              shape="rounded"
              disabled={loading}
            />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
