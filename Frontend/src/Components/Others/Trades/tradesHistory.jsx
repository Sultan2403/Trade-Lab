import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  CircularProgress,
  FormControl,
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
import UIInput from "../../UI/Common/input";

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
  if (value === null || value === undefined || Number.isNaN(Number(value)))
    return "--";
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
  return (
    (Number(trade.exit_price) - Number(trade.entry_price)) *
    Number(trade.size) *
    directionSign
  );
};

const calcRMultiple = (trade, pnl) => {
  if (trade.riskToReward !== undefined && trade.riskToReward !== null)
    return Number(trade.riskToReward);

  const riskPerUnit = Math.abs(
    Number(trade.entry_price) - Number(trade.stopLoss),
  );
  const riskAmount = riskPerUnit * Number(trade.size);

  if (
    !riskAmount ||
    Number.isNaN(riskAmount) ||
    pnl === null ||
    Number.isNaN(pnl)
  )
    return null;

  return pnl / riskAmount;
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

  const pagination = data?.pagination;

  const rows = useMemo(() => {
    const list = data?.trades ?? [];

    const filtered = list
      .filter((trade) => {
        const matchesSearch = [trade.pair, trade.notes].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(search.toLowerCase().trim()),
        );

        const matchesStatus =
          statusFilter === "All" || trade.status === statusFilter;
        const matchesDirection =
          directionFilter === "All" || trade.direction === directionFilter;

        return matchesSearch && matchesStatus && matchesDirection;
      })
      .map((trade) => {
        const pnl = calcPnl(trade);
        const riskToReward = calcRMultiple(trade, pnl);

        return {
          ...trade,
          pnl,
          riskToReward,
        };
      });

    const [field, order] = sortBy.split("-");
    const directionSign = order === "asc" ? 1 : -1;

    filtered.sort((a, b) => {
      if (field === "pair") return a.pair.localeCompare(b.pair) * directionSign;
      if (field === "pnl")
        return (
          ((a.pnl ?? Number.NEGATIVE_INFINITY) -
            (b.pnl ?? Number.NEGATIVE_INFINITY)) *
          directionSign
        );
      return (
        (new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime()) *
        directionSign
      );
    });

    return filtered;
  }, [data?.trades?.trades, directionFilter, search, sortBy, statusFilter]);

  return (
    <Paper
      className="rounded-panel border border-border bg-surface-card p-6"
      elevation={0}
    >
      <Stack spacing={3}>
        <Stack spacing={2}>
          {/* Optional subtle header */}
          <Typography fontSize="1.6rem" fontWeight={500} color="text.primary">
            Trades Overview
          </Typography>

          {/* Control bar */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            flexWrap="wrap"
          >
            {/* Left: Search */}
            <UIInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trades by pair"
              startIcon={<Search size={16} />}
              sx={{
                maxWidth: 280,
                borderRadius: "8px", // less rounded
                flex: 1, // grow to fill left side
              }}
            />

            {/* Right: Filters */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {[
                {
                  value: sortBy,
                  onChange: setSortBy,
                  options: sortOptions,
                  getLabel: (o) => o.label,
                  getValue: (o) => o.value,
                },
                {
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: statusOptions,
                  getLabel: (o) => o,
                  getValue: (o) => o,
                },
                {
                  value: directionFilter,
                  onChange: setDirectionFilter,
                  options: directionOptions,
                  getLabel: (o) => o,
                  getValue: (o) => o,
                },
              ].map((filter, i) => (
                <TextField
                  key={i}
                  select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  size="small"
                  variant="outlined"
                  sx={{
                    minWidth: 140,
                    borderRadius: "8px", // slightly rounded
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.85rem",
                      backgroundColor: "#fff",
                    },
                  }}
                >
                  {filter.options.map((opt) => (
                    <MenuItem
                      key={filter.getValue(opt)}
                      value={filter.getValue(opt)}
                      sx={{ fontSize: "0.85rem" }}
                    >
                      {filter.getLabel(opt)}
                    </MenuItem>
                  ))}
                </TextField>
              ))}
            </Stack>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error">Unable to load trades right now.</Alert>
        )}

        <TableContainer
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 2,
          }}
        >
          <Table
            sx={{
              "& th": {
                fontSize: 14,
                fontWeight: 500,
                color: "#374151",
                backgroundColor: "#F9FAFB",
                letterSpacing: "0.02em",
              },
              "& td": {
                fontSize: 13.5,
                color: "#111827",
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  "&:hover": {
                    backgroundColor: "#FAFAFA",
                    boxShadow: "inset 0 0 0 1px #F1F5F9",
                  },
                }}
              >
                {[
                  "Date",
                  "Instrument",
                  "Direction",
                  "Entry",
                  "Exit",
                  "Position Size",
                  "P&L",
                  "R-Multiple",
                  "Outcome",
                ].map((head) => (
                  <TableCell key={head}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow
                  sx={{
                    "&:hover": {
                      backgroundColor: "#FAFAFA",
                      boxShadow: "inset 0 0 0 1px #F1F5F9",
                    },
                  }}
                >
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={20} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" fontSize={14}>
                      No trades found for selected filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((trade) => (
                  <TableRow
                    key={trade.id}
                    hover
                    onClick={() => navigate(`/trades/${trade.id}`)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#FAFAFA",
                        boxShadow: "inset 0 0 0 1px #F1F5F9",
                      },
                    }}
                  >
                    <TableCell>{formatDate(trade.openedAt)}</TableCell>

                    {/* 👇 toned down (no heavy bold) */}
                    <TableCell sx={{ fontWeight: 500 }}>{trade.pair}</TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-gray-700">
                        {trade.direction === "Long" ? (
                          <ArrowUp size={14} className="text-green-600" />
                        ) : (
                          <ArrowDown size={14} className="text-red-600" />
                        )}
                        {trade.direction}
                      </span>
                    </TableCell>

                    <TableCell align="right">
                      {formatPrice(trade.entry_price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(trade.exit_price)}
                    </TableCell>
                    <TableCell align="right">
                      {trade.size ? `${trade.size} Lots` : "--"}
                    </TableCell>

                    {/* 👇 PnL = ONLY thing that pops */}
                    <TableCell>
                      {trade.pnl === null ? (
                        "--"
                      ) : (
                        <span
                          style={{
                            fontWeight: 500,
                            color: trade.pnl >= 0 ? "#16A34A" : "#DC2626",
                          }}
                        >
                          {formatPrice(trade.pnl)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {trade.riskToReward === null
                        ? "--"
                        : trade.riskToReward.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const styles = {
                          Win: {
                            bg: "#ECFDF3",
                            color: "#027A48",
                          },
                          Loss: {
                            bg: "#FEF3F2",
                            color: "#B42318",
                          },
                          Breakeven: {
                            bg: "#F2F4F7",
                            color: "#344054",
                          },
                          Open: {
                            bg: "#FFFAEB",
                            color: "#B54708",
                          },
                        };

                        const s = styles[trade.outcome] || styles.Breakeven;

                        return (
                          <span
                            style={{
                              backgroundColor: s.bg,
                              color: s.color,
                              fontSize: 12,
                              fontWeight: 500,
                              padding: "4px 10px",
                              borderRadius: 999,
                              display: "inline-block",
                            }}
                          >
                            {trade.outcome}
                          </span>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
          justifyContent="space-between"
        >
          <Typography color="text.secondary">
            Showing page {pagination?.page ?? page} of {pagination?.pages ?? 1}{" "}
            ({pagination?.total ?? 0} total trades)
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

export function TradesTable() {
  const [rows, setRows] = useState([]);
  const { data, error, loading, getTrades } = useTrades();

  useEffect(() => {
    getTrades();
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log(data)
    setRows(data?.trades);
  }, [data]);
  return (
    <Paper  
      className="rounded-panel border border-border bg-surface-card p-6"
      elevation={0}
    >
      {error && (
        <Alert severity="error">Unable to load trades right now.</Alert>
      )}

      <TableContainer
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 2,
        }}
      >
        <Table
          sx={{
            "& th": {
              fontSize: 14,
              fontWeight: 500,
              color: "#374151",
              backgroundColor: "#F9FAFB",
              letterSpacing: "0.02em",
            },
            "& td": {
              fontSize: 13.5,
              color: "#111827",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                "&:hover": {
                  backgroundColor: "#FAFAFA",
                  boxShadow: "inset 0 0 0 1px #F1F5F9",
                },
              }}
            >
              {[
                "Date",
                "Instrument",
                "Direction",
                "Entry",
                "Exit",
                "Position Size",
                "P&L",
                "R-Multiple",
                "Outcome",
              ].map((head) => (
                <TableCell key={head}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow
                sx={{
                  "&:hover": {
                    backgroundColor: "#FAFAFA",
                    boxShadow: "inset 0 0 0 1px #F1F5F9",
                  },
                }}
              >
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary" fontSize={14}>
                    No trades found for selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((trade) => (
                <TableRow
                  key={trade.id}
                  hover
                  onClick={() => navigate(`/trades/${trade.id}`)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#FAFAFA",
                      boxShadow: "inset 0 0 0 1px #F1F5F9",
                    },
                  }}
                >
                  <TableCell>{formatDate(trade.openedAt)}</TableCell>

                  {/* 👇 toned down (no heavy bold) */}
                  <TableCell sx={{ fontWeight: 500 }}>{trade.pair}</TableCell>

                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-gray-700">
                      {trade.direction === "Long" ? (
                        <ArrowUp size={14} className="text-green-600" />
                      ) : (
                        <ArrowDown size={14} className="text-red-600" />
                      )}
                      {trade.direction}
                    </span>
                  </TableCell>

                  <TableCell align="right">
                    {formatPrice(trade.entry_price)}
                  </TableCell>
                  <TableCell align="right">
                    {formatPrice(trade.exit_price)}
                  </TableCell>
                  <TableCell align="right">
                    {trade.size ? `${trade.size} Lots` : "--"}
                  </TableCell>

                  {/* 👇 PnL = ONLY thing that pops */}
                  <TableCell>
                    {trade.pnl === null ? (
                      "--"
                    ) : (
                      <span
                        style={{
                          fontWeight: 500,
                          color: trade.pnl >= 0 ? "#16A34A" : "#DC2626",
                        }}
                      >
                        {formatPrice(trade.pnl)}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    {trade.riskToReward === null
                      ? "--"
                      : trade.riskToReward.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    {(() => {
                      const styles = {
                        Win: {
                          bg: "#ECFDF3",
                          color: "#027A48",
                        },
                        Loss: {
                          bg: "#FEF3F2",
                          color: "#B42318",
                        },
                        Breakeven: {
                          bg: "#F2F4F7",
                          color: "#344054",
                        },
                        Open: {
                          bg: "#FFFAEB",
                          color: "#B54708",
                        },
                      };

                      const s = styles[trade.outcome] || styles.Breakeven;

                      return (
                        <span
                          style={{
                            backgroundColor: s.bg,
                            color: s.color,
                            fontSize: 12,
                            fontWeight: 500,
                            padding: "4px 10px",
                            borderRadius: 999,
                            display: "inline-block",
                          }}
                        >
                          {trade.outcome}
                        </span>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
