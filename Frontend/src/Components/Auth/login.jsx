import { useEffect, useMemo, useState } from "react";
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

  const formError = useMemo(
    () =>
      error?.response?.data?.validation?.body?.message ||
      error?.response?.data?.message,
    [error],
  );

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
          <NavLink
            to="/register"
            className="font-medium text-brand-800 hover:text-brand-900"
          >
            Sign up
          </NavLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {!!error && !fieldErrors.email && !fieldErrors.password && (
          <p className="rounded-panel border border-state-danger-soft bg-state-danger-soft px-3 py-2 text-caption text-state-danger">
            {formError}
          </p>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-caption font-medium text-text-secondary"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="ui-input py-2.5 text-caption"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-caption text-state-danger">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-caption font-medium text-text-secondary"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={userData.password}
              onChange={handleChange}
              placeholder="••••••••••••••••"
              className="ui-input py-2.5 pr-11 text-caption"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-caption text-state-danger">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <label className="inline-flex items-center gap-2 text-caption text-text-secondary">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-brand-800 focus:ring-brand-700"
            />
            Remember me
          </label>

          <button
            type="button"
            className="text-caption font-medium text-brand-800 hover:text-brand-900"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="ui-btn-primary mt-1 w-full py-2 text-body"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-caption text-text-muted">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            className="ui-btn-secondary w-full py-2 text-caption text-text-primary"
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="ui-btn-secondary flex w-full items-center justify-center gap-2 py-2 text-caption text-text-primary"
          >
            <Github size={16} />
            Continue with GitHub
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
