import { Link } from "@remix-run/react";
import { useState } from "react";
import HoverBannerMenu from "./HoverBannerMenu";

interface MenuItem {
  title: string;
  handle: string;
  description: string;
  quickLinks: Array<{
    label: string;
    handle: string;
  }>;
}

interface NavBarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export default function NavBar({ mobileOpen = false, onNavigate }: NavBarProps) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: "Apparel",
      handle: "apparel",
      description: "Explore our latest clothing collection",
      quickLinks: [
        { label: "Shop New", handle: "apparel?sort=newest" },
        { label: "Shop Bestsellers", handle: "apparel?sort=bestselling" },
        { label: "View All", handle: "apparel" },
      ],
    },
    {
      title: "Accessories",
      handle: "accessories",
      description: "Complete your look with perfect accessories",
      quickLinks: [
        { label: "Shop New", handle: "accessories?sort=newest" },
        { label: "Shop Bestsellers", handle: "accessories?sort=bestselling" },
        { label: "View All", handle: "accessories" },
      ],
    },
    {
      title: "Jewelry",
      handle: "jewelry",
      description: "Elegant pieces for every occasion",
      quickLinks: [
        { label: "Shop New", handle: "jewelry?sort=newest" },
        { label: "Shop Bestsellers", handle: "jewelry?sort=bestselling" },
        { label: "View All", handle: "jewelry" },
      ],
    },
    {
      title: "Shoes",
      handle: "shoes",
      description: "Step up your style game",
      quickLinks: [
        { label: "Shop New", handle: "shoes?sort=newest" },
        { label: "Shop Bestsellers", handle: "shoes?sort=bestselling" },
        { label: "View All", handle: "shoes" },
      ],
    },
    {
      title: "Sale",
      handle: "sale",
      description: "Amazing deals you don't want to miss",
      quickLinks: [
        { label: "Up to 50% Off", handle: "sale?discount=50" },
        { label: "Clearance", handle: "sale?type=clearance" },
        { label: "View All", handle: "sale" },
      ],
    },
    {
      title: "Women",
      handle: "women",
      description: "Fashion for her",
      quickLinks: [
        { label: "Shop New", handle: "women?sort=newest" },
        { label: "Shop Bestsellers", handle: "women?sort=bestselling" },
        { label: "View All", handle: "women" },
      ],
    },
    {
      title: "Men",
      handle: "men",
      description: "Fashion for him",
      quickLinks: [
        { label: "Shop New", handle: "men?sort=newest" },
        { label: "Shop Bestsellers", handle: "men?sort=bestselling" },
        { label: "View All", handle: "men" },
      ],
    },
    {
      title: "Kids",
      handle: "kids",
      description: "Fun styles for children",
      quickLinks: [
        { label: "Shop New", handle: "kids?sort=newest" },
        { label: "Boys & Girls", handle: "kids" },
        { label: "View All", handle: "kids" },
      ],
    },
    {
      title: "Bestseller",
      handle: "bestseller",
      description: "Our most popular items",
      quickLinks: [
        { label: "Top Rated", handle: "bestseller?sort=rating" },
        { label: "Most Popular", handle: "bestseller?sort=bestselling" },
        { label: "View All", handle: "bestseller" },
      ],
    },
  ];

  return (
    <>
      <nav className="hidden flex-1 md:block">
        <ul className="flex flex-wrap items-center gap-1">
          {menuItems.map((item) => (
            <li
              key={item.title}
              className="relative"
              onMouseEnter={() => setHoveredMenu(item.title)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link to={`/collections/${item.handle}`} className="block rounded-md px-4 py-3 text-sm font-medium uppercase tracking-wide text-gray-600 transition hover:bg-gray-50 hover:text-primary">
                {item.title}
              </Link>
              <HoverBannerMenu
                title={item.title}
                description={item.description}
                quickLinks={item.quickLinks}
                isVisible={hoveredMenu === item.title}
              />
            </li>
          ))}
        </ul>
      </nav>

      {mobileOpen && (
        <nav className="border-t border-gray-200 pt-4 md:hidden">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={`/collections/${item.handle}`}
                  onClick={onNavigate}
                  className="block rounded-md border border-gray-200 px-3 py-3 text-center text-sm font-medium uppercase tracking-wide text-gray-700 transition hover:bg-gray-50 hover:text-primary"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
