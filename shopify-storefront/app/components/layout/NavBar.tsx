import { Link } from "@remix-run/react";
import { useState } from "react";
import HoverBannerMenu from "./HoverBannerMenu";

export default function NavBar() {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const menuItems = [
    {
      title: "Women",
      href: "/collections/women",
      submenu: ["Apparel", "Accessories", "Jewelry", "Shoes"],
    },
    {
      title: "Men",
      href: "/collections/men",
      submenu: ["Apparel", "Accessories", "Shoes"],
    },
    {
      title: "Kids",
      href: "/collections/kids",
      submenu: ["Boys", "Girls", "Accessories"],
    },
    {
      title: "Sale",
      href: "/collections/sale",
      submenu: ["Women's Sale", "Men's Sale", "Kids Sale"],
    },
    {
      title: "Bestsellers",
      href: "/collections/bestseller",
      submenu: [],
    },
  ];

  return (
    <nav className="navbar">
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li
            key={item.title}
            className="nav-item"
            onMouseEnter={() => setHoveredMenu(item.title)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <Link to={item.href}>{item.title}</Link>
            {hoveredMenu === item.title && item.submenu.length > 0 && (
              <HoverBannerMenu items={item.submenu} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
