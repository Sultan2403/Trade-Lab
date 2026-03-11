import { TextField } from "@mui/material";

export default function UIInput({ error, helperText, sx, ...props }) {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      error={Boolean(error)}
      helperText={helperText || ""}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          fontSize: "0.875rem",
          backgroundColor: "#fff",
        },

        "& .MuiInputBase-input": {
          padding: "10px 12px",
        },

        "& .MuiFormHelperText-root": {
          marginLeft: "2px",
          fontSize: "0.75rem",
        },

        ...sx,
      }}
      {...props}
    />
  );
}
