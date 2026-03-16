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
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <Form method="post" className="space-y-6">
        {errors?.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="John"
              autoComplete="given-name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            {errors?.firstName && (
              <span className="text-red-500 text-sm mt-1 block">{errors.firstName}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              placeholder="Doe"
              autoComplete="family-name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            {errors?.lastName && (
              <span className="text-red-500 text-sm mt-1 block">{errors.lastName}</span>
            )}
          </div>
        </div>

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
            autoComplete="new-password"
            minLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          {errors?.password && (
            <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
          )}
          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptsMarketing"
            name="acceptsMarketing"
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="acceptsMarketing" className="text-sm text-gray-600">
            Subscribe to our newsletter for special offers and updates
          </label>
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Create Account
        </button>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/account/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
