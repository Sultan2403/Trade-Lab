import { TextField, InputAdornment } from "@mui/material";

export default function UIInput({
  startIcon,
  endIcon,
  error,
  helperText,
  sx,
  ...rest
}) {
  return (
    <TextField
      {...rest}
      variant="outlined"
      size="small"
      fullWidth
      error={Boolean(error)}
      helperText={helperText || ""}
      slotProps={{
        input: {
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ) : undefined,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          fontSize: "0.875rem",
          backgroundColor: "#fff",
        },
        ...sx,
      }}
    />
  );
}
