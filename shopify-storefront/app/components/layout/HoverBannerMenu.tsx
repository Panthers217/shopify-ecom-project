import { Link } from "@remix-run/react";

interface HoverBannerMenuProps {
  items: string[];
}

export default function HoverBannerMenu({ items }: HoverBannerMenuProps) {
  return (
    <div className="hover-banner-menu">
      <ul className="banner-menu-list">
        {items.map((item) => (
          <li key={item}>
            <Link to={`/collections/${item.toLowerCase().replace(/\s+/g, "-")}`}>
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
