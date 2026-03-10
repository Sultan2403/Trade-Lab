import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Eye, EyeOff, Github } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../Hooks/useAuth";
import { setAccessToken, setRefreshToken } from "../../Helpers/Auth/tokens";
import { validateUserLogin } from "../../Validators/auth.validator";
import AuthLayout from "./Layout";

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { data, error, loading, login } = useAuth();
  const navigate = useNavigate();

  const backendErrMsg = error?.response?.data?.message;
  const formError = useMemo(() => backendErrMsg, [backendErrMsg]);

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

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateUserLogin(userData);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    login(userData);
  };

  useEffect(() => {
    if (data?.success) {
      const { accessToken, refreshToken } = data.tokens;
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      navigate("/dashboard");
    }
  }, [data]);

  return (
    <AuthLayout
      tab="login"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Button
            component={NavLink}
            to="/register"
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
            Sign up
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {!!error && !fieldErrors.email && !fieldErrors.password && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          sx={inputStyles}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          type={showPassword ? "text" : "password"}
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

        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ p: 0.5 }}
              />
            }
            label="Remember me"
            sx={{ m: 0, ".MuiFormControlLabel-label": { color: "#4b5563" } }}
          />

          <Button type="button" variant="text" sx={{ textTransform: "none", color: "#0f5c6d" }}>
            Forgot password?
          </Button>
        </Stack>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
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
        >
          {loading ? "Logging in..." : "Log In"}
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
