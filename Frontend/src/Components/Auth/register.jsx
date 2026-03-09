import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Eye, EyeOff, Github } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../Hooks/useAuth";
import { getBackendError, getCelebrateFieldErrors } from "../../Helpers/Auth/errors";
import { validateUserRegister } from "../../Validators/auth.validator";

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.61 20.08H42V20H24v8h11.3C33.66 32.66 29.27 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.06 6.05 29.27 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92z"
      />
      <path
        fill="#FF3D00"
        d="M6.31 14.69l6.57 4.82C14.66 16.02 19 12 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.06 6.05 29.27 4 24 4 16.32 4 9.66 8.34 6.31 14.69z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.16 0 9.86-1.98 13.41-5.2l-6.19-5.24C29.18 35.09 26.7 36 24 36c-5.25 0-9.62-3.32-11.27-7.98l-6.52 5.02C9.52 39.56 16.23 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.61 20.08H42V20H24v8h11.3c-.78 2.28-2.24 4.24-4.08 5.56l.01-.01 6.19 5.24C36.98 39.21 44 34 44 24c0-1.34-.14-2.65-.39-3.92z"
      />
    </svg>
  );
}

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

  const formError = useMemo(
    () => getBackendError(error, "Registration failed. Please try again."),
    [error],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedPayload = {
      ...userData,
      username: userData.username?.trim() || userData.email?.split("@")[0] || "",
    };

    const errors = validateUserRegister(normalizedPayload);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    register(normalizedPayload);
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    const backendErrors = getCelebrateFieldErrors(error);
    if (Object.keys(backendErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...backendErrors }));
    }
  }, [error]);

  useEffect(() => {
    if (data?.success) {
      navigate("/login");
    }
  }, [data, navigate]);

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="grid h-14 w-14 place-items-center rounded-field bg-brand-800">
            <ArrowUpRight size={28} className="text-white" />
          </div>
          <h1 className="text-[52px] font-semibold tracking-tight">TradeLog</h1>
          <p className="text-[18px] text-text-muted">Your professional trading journal</p>
        </div>

        <div className="mb-7 flex rounded-field border border-border bg-slate-50/30">
          <NavLink to="/login" className="auth-tab transition-colors hover:text-text-primary">
            Log In
          </NavLink>
          <span className="auth-tab auth-tab-active">Sign Up</span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4.5">
          {!!error && !Object.keys(fieldErrors).length && (
            <p className="rounded-field border border-red-200 bg-red-50 px-3 py-2 text-[16px] text-danger">
              {formError}
            </p>
          )}

          <div>
            <label htmlFor="username" className="auth-label">
              Name (Optional)
            </label>
            <input
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="auth-input"
            />
            {fieldErrors.username && (
              <p className="mt-1 text-sm text-danger">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="auth-input"
            />
            {fieldErrors.email && <p className="mt-1 text-sm text-danger">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={userData.password}
                onChange={handleChange}
                placeholder="Create your password"
                className="auth-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-danger">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="auth-label">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="auth-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-danger">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="auth-primary-btn mt-2">
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <div className="flex items-center gap-4 py-2 text-[16px] text-text-muted">
            <span className="h-px flex-1 bg-border"></span>
            <span>or continue with</span>
            <span className="h-px flex-1 bg-border"></span>
          </div>

          <div className="space-y-3">
            <button type="button" className="auth-social-btn flex items-center justify-center gap-2">
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <button type="button" className="auth-social-btn flex items-center justify-center gap-2">
              <Github size={20} className="text-[#111827]" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <p className="pt-2 text-center text-[16px] text-text-muted">
            Already have an account?{" "}
            <NavLink to="/login" className="font-medium text-brand-800 hover:text-brand-900">
              Log in
            </NavLink>
          </p>
        </form>
      </div>
    </section>
  );
}
