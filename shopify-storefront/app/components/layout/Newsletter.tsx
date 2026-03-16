import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function Newsletter() {
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = fetcher.state !== "idle";
  const isSuccess = fetcher.data?.success;
  const error = fetcher.data?.error;

  useEffect(() => {
    if (isSuccess) {
      formRef.current?.reset();
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-4 lg:col-span-1 md:col-span-2">
      <h3 className="text-base font-semibold text-gray-100 uppercase tracking-wide">Newsletter</h3>
      <p className="text-sm">Subscribe to get special offers and updates</p>

      {isSuccess ? (
        <p className="text-sm text-green-400 font-medium">Thanks for subscribing! 🎉</p>
      ) : (
        <fetcher.Form method="post" action="/api/newsletter" ref={formRef} className="flex gap-2">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-600"
            aria-label="Email for newsletter"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-primary text-white rounded-md font-semibold text-sm hover:bg-primary-dark transition disabled:opacity-60"
          >
            {isSubmitting ? "..." : "Subscribe"}
          </button>
        </fetcher.Form>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">FB</a>
        <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">IG</a>
        <a href="#" aria-label="Twitter" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">TW</a>
      </div>
    </div>
  );
}
