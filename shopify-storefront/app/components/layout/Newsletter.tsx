import { FormEvent, useState } from "react";

export default function Newsletter() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const email = formData.get("email");

    if (typeof email === "string") {
      setSubmittedEmail(email);
      setIsSubscribed(true);
      form.reset();
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:col-span-1 md:col-span-2">
      <h3 className="text-base font-semibold text-gray-100 uppercase tracking-wide">Newsletter</h3>
      <p className="text-sm">Subscribe to get special offers and updates</p>

      {isSubscribed ? (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3">
          <p className="text-sm font-semibold text-emerald-300">Subscription Confirmed</p>
          <p className="mt-1 text-xs text-emerald-100/90">
            {submittedEmail} has been marked as subscribed for this project demo.
            This is a portfolio simulation, so no real newsletter enrollment was created.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
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
            className="px-5 py-2 bg-primary text-white rounded-md font-semibold text-sm hover:bg-primary-dark transition"
          >
            Subscribe
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">FB</a>
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">IG</a>
        <a href="https://www.twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">TW</a>
      </div>
    </div>
  );
}
