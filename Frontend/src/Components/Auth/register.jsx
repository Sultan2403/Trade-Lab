import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Eye, EyeOff, Github } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import AuthLayout from "./Layout";
import useAuth from "../../Hooks/useAuth";
import { validateUserRegister } from "../../Validators/auth.validator";

export default function Register() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { data, error, loading, register } = useAuth();

  const backendError = useMemo(
    () => error?.response?.data?.message || error?.response?.data?.validation?.body?.message,
    [error],
  );

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
      backgroundColor: "#f6f7f8",
      "& fieldset": { borderColor: "#d2d9df" },
      "&:hover fieldset": { borderColor: "#bcc7d0" },
      "&.Mui-focused fieldset": { borderColor: "#0f5c6d" },
    },
    "& .MuiInputBase-input::placeholder": { opacity: 1, color: "#9ca3af" },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateUserRegister(userData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    register(userData);
  };

  useEffect(() => {
    if (data?.success) {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [data, navigate]);

  return (
    <AuthLayout
      tab="register"
      footer={
        <>
          Already have an account?{" "}
          <Button
            component={NavLink}
            to="/login"
            type="button"
            variant="text"
            sx={{
              textTransform: "none",
              color: "#0f5c6d",
              p: 0,
              minWidth: 0,
              fontSize: "inherit",
            }}
          >
            Log in
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {backendError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {backendError}
          </Alert>
        )}

        {data?.success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful. Redirecting to login...
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={userData.username}
          onChange={handleChange}
          margin="normal"
          placeholder="Choose a username"
          error={Boolean(fieldErrors.username)}
          helperText={fieldErrors.username}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          margin="normal"
          placeholder="Enter your email"
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={userData.password}
          onChange={handleChange}
          margin="normal"
          placeholder="••••••••••••••••"
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
          sx={inputStyles}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={userData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          placeholder="••••••••••••••••"
          error={Boolean(fieldErrors.confirmPassword)}
          helperText={fieldErrors.confirmPassword}
          sx={inputStyles}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            py: 1.3,
            textTransform: "none",
            fontSize: "1.35rem",
            bgcolor: "#0f5c6d",
            borderRadius: 1,
            boxShadow: "none",
            "&:hover": { bgcolor: "#0c5160", boxShadow: "none" },
          }}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        <Stack direction="row" alignItems="center" spacing={1.5} my={3}>
          <Divider sx={{ flex: 1 }} />
          <Box sx={{ color: "#6b7280", whiteSpace: "nowrap" }}>or continue with</Box>
          <Divider sx={{ flex: 1 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            type="button"
            sx={{
              py: 1.15,
              textTransform: "none",
              borderColor: "#d2d9df",
              color: "#111827",
              borderRadius: 1,
              fontSize: "1.15rem",
            }}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            type="button"
            startIcon={<Github size={18} />}
            sx={{
              py: 1.15,
              textTransform: "none",
              borderColor: "#d2d9df",
              color: "#111827",
              borderRadius: 1,
              fontSize: "1.15rem",
            }}
          >
            Continue with GitHub
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
