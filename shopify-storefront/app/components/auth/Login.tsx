import { Form, Link } from "@remix-run/react";

interface LoginProps {
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
}

export default function Login({ errors }: LoginProps) {
  return (
    <div className="login-form">
      <Form method="post" className="auth-form">
        {errors?.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="your@email.com"
            autoComplete="email"
          />
          {errors?.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors?.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>

        <div className="form-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/account/signup">Sign up</Link>
          </p>
          <Link to="/account/reset" className="forgot-password">
            Forgot password?
          </Link>
        </div>
      </Form>
    </div>
  );
}
