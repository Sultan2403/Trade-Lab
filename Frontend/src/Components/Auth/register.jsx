import { useEffect, useMemo, useState } from "react";
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
    () => error?.response?.data?.validation?.body?.message || error?.response?.data?.message ,
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

    // const errors = validateUserRegister(userData);
    // setFieldErrors(errors);

    // if (Object.keys(errors).length > 0) return;

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
          <NavLink to="/login" className="font-medium text-brand-800 hover:text-brand-900">
            Log in
          </NavLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {backendError && (
          <p className="rounded-panel border border-state-danger-soft bg-state-danger-soft px-3 py-2 text-caption text-state-danger">
            {backendError}
          </p>
        )}

        {data?.success && (
          <p className="rounded-panel border border-state-success-soft bg-state-success-soft px-3 py-2 text-caption text-state-success">
            Registration successful. Redirecting to login...
          </p>
        )}

        <div>
          <label htmlFor="username" className="mb-1.5 block text-caption font-medium text-text-secondary">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            className="ui-input py-2.5 text-caption"
          />
          {fieldErrors.username && <p className="mt-1 text-caption text-state-danger">{fieldErrors.username}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-caption font-medium text-text-secondary">
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
          {fieldErrors.email && <p className="mt-1 text-caption text-state-danger">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-caption font-medium text-text-secondary">
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
          {fieldErrors.password && <p className="mt-1 text-caption text-state-danger">{fieldErrors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-caption font-medium text-text-secondary">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••••••••"
              className="ui-input py-2.5 pr-11 text-caption"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-caption text-state-danger">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="ui-btn-primary mt-1 w-full py-2 text-body">
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-caption text-text-muted">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2.5">
          <button type="button" className="ui-btn-secondary w-full py-2 text-caption text-text-primary">
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
