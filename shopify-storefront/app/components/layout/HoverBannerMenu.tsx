import { Link } from "@remix-run/react";

interface QuickLink {
  label: string;
  handle: string;
}

interface HoverBannerMenuProps {
  title: string;
  description: string;
  quickLinks: QuickLink[];
  isVisible: boolean;
}

export default function HoverBannerMenu({
  title,
  description,
  quickLinks,
  isVisible,
}: HoverBannerMenuProps) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-opacity duration-200 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white shadow-xl rounded-xl p-6 min-w-[320px]">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          <ul className="flex flex-col gap-2 pt-2 border-t border-gray-200">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={`/collections/${link.handle}`}
                  className="flex items-center justify-between px-3 py-2.5 text-gray-600 font-medium text-sm rounded-md hover:bg-gray-50 hover:text-primary transition group"
                >
                  {link.label}
                  <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
