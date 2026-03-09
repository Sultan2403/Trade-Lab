import { useState, useEffect } from "react";
import { TextField, Button, InputAdornment, Alert } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "./Layout";
import useAuth from "../../Hooks/useAuth";
import { validateUserLogin } from "../../Validators/auth.validator";
import { setRefreshToken, setAccessToken } from "../../Helpers/Auth/tokens";

export default function Login() {
  // State init

  const [userData, setUserData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const { data, error, loading, login } = useAuth();

  // Funcs

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear field error as user types
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
      setRefreshToken(data?.tokens?.refreshToken);
      setAccessToken(data?.tokens?.accessToken);
      navigate("/");
    }
  }, [data]);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account"
      footer={
        <>
          Don’t have an account?{" "}
          <NavLink to="/register" style={{ color: "#6366f1", fontWeight: 500 }}>
            Register
          </NavLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* FORM-LEVEL ERROR (backend / unexpected) */}
        {error && !fieldErrors.email && !fieldErrors.password && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.response?.data?.message ||
              "Login failed. Please try again."}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={userData.email || ""}
          onChange={handleChange}
          margin="normal"
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          slotProps={{
            htmlInput: {
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={18} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={userData.password || ""}
          onChange={handleChange}
          margin="normal"
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
          slotProps={{
            htmlInput: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} />
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
          sx={{ mt: 3, py: 1.2 }}
          disabled={loading}
          loading={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
}
