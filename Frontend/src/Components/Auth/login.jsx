import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowUpRight, Eye, EyeOff, Github } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { validateUserLogin } from "../../Validators/auth.validator";
import { setAccessToken, setRefreshToken } from "../../Helpers/Auth/tokens";

function getApiErrorMessage(error) {
  const fallback = "Login failed. Please try again.";

  if (!error?.response?.data) return fallback;

  const data = error.response.data;

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  const firstCelebrateError = data?.validation?.body?.details?.[0]?.message;
  if (firstCelebrateError) {
    return firstCelebrateError;
  }

  return fallback;
}

function getCelebrateFieldErrors(error) {
  const details = error?.response?.data?.validation?.body?.details;
  if (!Array.isArray(details)) {
    return {};
  }

  return details.reduce((acc, item) => {
    const path = item?.path?.[0];
    if (typeof path === "string") {
      acc[path] = item?.message || "Invalid value";
    }

    return acc;
  }, {});
}

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { data, error, loading, login } = useAuth();

  const formError = useMemo(() => getApiErrorMessage(error), [error]);

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
    if (!error) {
      return;
    }

    const celebrateErrors = getCelebrateFieldErrors(error);
    if (Object.keys(celebrateErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...celebrateErrors }));
    }
  }, [error]);

  useEffect(() => {
    if (data?.success) {
      setRefreshToken(data?.tokens?.refreshToken);
      setAccessToken(data?.tokens?.accessToken);
      navigate("/");
    }
  }, [data, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f7f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 2,
          border: "1px solid #d6dbe1",
          p: { xs: 3, sm: 4 },
        }}
      >
        <Stack alignItems="center" spacing={1.5} mb={3.5}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 2,
              bgcolor: "#0e5c6d",
              display: "grid",
              placeItems: "center",
            }}
          >
            <ArrowUpRight color="#fff" size={30} />
          </Box>

          <Typography variant="h4" fontWeight={700} sx={{ fontSize: "2rem" }}>
            TradeLog
          </Typography>

          <Typography color="text.secondary" textAlign="center">
            Your professional trading journal
          </Typography>
        </Stack>

        <Tabs value={0} variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="Log In" sx={{ textTransform: "none", fontWeight: 600 }} />
          <Tab
            component={NavLink}
            to="/register"
            label="Sign Up"
            sx={{ textTransform: "none", color: "text.secondary" }}
          />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {!!error && !fieldErrors.email && !fieldErrors.password && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

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
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            margin="normal"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    size="small"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                ),
              },
            }}
          />

          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.25}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Link component="button" type="button" underline="hover" color="#0e5c6d">
              Forgot password?
            </Link>
          </Stack>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 1.5,
              py: 1.2,
              bgcolor: "#0e5c6d",
              textTransform: "none",
              fontSize: "1.1rem",
              "&:hover": { bgcolor: "#0c5160" },
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <Stack direction="row" alignItems="center" spacing={2} mt={3} mb={2}>
            <Divider sx={{ flex: 1 }} />
            <Typography color="text.secondary">or continue with</Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          <Stack spacing={1.5}>
            <Button
              fullWidth
              type="button"
              variant="outlined"
              sx={{ textTransform: "none", py: 1.1 }}
              onClick={() => {}}
            >
              Continue with Google
            </Button>

            <Button
              fullWidth
              type="button"
              variant="outlined"
              sx={{ textTransform: "none", py: 1.1 }}
              startIcon={<Github size={18} />}
              onClick={() => {}}
            >
              Continue with GitHub
            </Button>
          </Stack>

          <Typography align="center" color="text.secondary" mt={3.5}>
            Don&apos;t have an account?{" "}
            <Link component={NavLink} to="/register" underline="hover" color="#0e5c6d">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
