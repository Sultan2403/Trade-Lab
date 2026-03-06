import { useState, useEffect } from "react";
import { TextField, Button, InputAdornment, Alert } from "@mui/material";
import { User, Mail, Lock } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthLayout from "./Layout";
import useAuth from "../../Hooks/useAuth";
import { validateUserRegister } from "../../Validators/auth.validator";

export default function Register() {
  const [userData, setUserData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const { data, error, loading, register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
 
    // clear field error as user types
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
    (data)
    if (data?.success) {
      setToken(data?.token)
      (data?.token)
      navigate("/");
    }
  }, [data]);

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Get started in seconds"
      footer={
        <>
          Already have an account?{" "}
          <NavLink to="/login" style={{ color: "#6366f1", fontWeight: 500 }}>
            Login
          </NavLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Form-level backend error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.response?.data?.message || "Registration failed. Please try again later."}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={userData.username || ""}
          onChange={handleChange}
          margin="normal"
          error={Boolean(fieldErrors.username)}
          helperText={fieldErrors.username}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <User size={18} />
                </InputAdornment>
              ),
            },
          }}
        />

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
            input: {
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
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={userData.confirmPassword || ""}
          onChange={handleChange}
          margin="normal"
          error={Boolean(fieldErrors.confirmPassword)}
          helperText={fieldErrors.confirmPassword}
          slotProps={{
            input: {
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
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
}
