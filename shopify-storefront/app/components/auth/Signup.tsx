import { Form, Link } from "@remix-run/react";

interface SignupProps {
  errors?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    general?: string;
  };
}

export default function Signup({ errors }: SignupProps) {
  return (
    <div className="signup-form">
      <Form method="post" className="auth-form">
        {errors?.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="John"
              autoComplete="given-name"
            />
            {errors?.firstName && (
              <span className="field-error">{errors.firstName}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              placeholder="Doe"
              autoComplete="family-name"
            />
            {errors?.lastName && (
              <span className="field-error">{errors.lastName}</span>
            )}
          </div>
        </div>

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
            autoComplete="new-password"
            minLength={8}
          />
          {errors?.password && (
            <span className="field-error">{errors.password}</span>
          )}
          <small>Password must be at least 8 characters</small>
        </div>

        <button type="submit" className="submit-btn">
          Create Account
        </button>

        <div className="form-footer">
          <p>
            Already have an account?{" "}
            <Link to="/account/login">Login</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
