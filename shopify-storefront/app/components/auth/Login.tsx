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
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <Form method="post" className="space-y-6">
        {errors?.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="your@email.com"
            autoComplete="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          {errors?.email && (
            <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          {errors?.password && (
            <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Sign In
        </button>

        <div className="space-y-3 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/account/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign up
            </Link>
          </p>
          <div className="text-center">
            <Link to="/account/reset" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot password?
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
