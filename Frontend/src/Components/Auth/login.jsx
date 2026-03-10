import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
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
import { setAccessToken, setRefreshToken } from "../../Helpers/Auth/tokens";
import { validateUserLogin } from "../../Validators/auth.validator";

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { data, error, loading, login } = useAuth();
  const navigate = useNavigate();

  const backendErrMsg = error?.response?.data?.message;

  const formError = useMemo(() => backendErrMsg, [error]);

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
  }, [error]);

  useEffect(() => {
    if (data?.success) {
      const { accessToken, refreshToken } = data.tokens;
      setRefreshToken(refreshToken);
      setAccessToken(accessToken);
      navigate("/dashboard");
    }
  }, [data]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f6f8",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: { xs: 3, sm: 4 },
          border: "1px solid #d5dce3",
          borderRadius: 2,
        }}
      >
        <Stack spacing={1.5} alignItems="center" mb={3.5}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: "#0f5c6d",
              display: "grid",
              placeItems: "center",
            }}
          >
            <ArrowUpRight size={28} color="#fff" />
          </Box>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: "2rem" }}>
            TradeLog
          </Typography>
          <Typography color="text.secondary">
            Your professional trading journal
          </Typography>
        </Stack>

        <Tabs value={0} variant="fullWidth" sx={{ mb: 2.5 }}>
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
            margin="normal"
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </IconButton>
                ),
              },
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
          >
            <Button
              type="button"
              variant="text"
              sx={{ textTransform: "none", color: "#0f5c6d" }}
            >
              Forgot password?
            </Button>
          </Stack>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 1,
              py: 1.2,
              textTransform: "none",
              fontSize: "1.1rem",
              bgcolor: "#0f5c6d",
              "&:hover": { bgcolor: "#0c5160" },
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <Stack direction="row" alignItems="center" spacing={1.5} my={3}>
            <Divider sx={{ flex: 1 }} />
            <Typography color="text.secondary">or continue with</Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              type="button"
              sx={{ py: 1.1, textTransform: "none" }}
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              type="button"
              startIcon={<Github size={18} />}
              sx={{ py: 1.1, textTransform: "none" }}
            >
              Continue with GitHub
            </Button>
          </Stack>

          <Typography align="center" color="text.secondary" mt={3.5}>
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
              }}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
