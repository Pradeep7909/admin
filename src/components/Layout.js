import Link from "next/link";
import {useRouter} from "next/router";
import {images} from "../../constant";
import {getUserDetails} from "../helper";

// Reusable NavButton Component
const NavButton = ({href, icon, alt, label}) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} passHref>
      <button
        className={`w-100 tab rounded text-left mb-4 py-2 d-flex align-items-center ${isActive ? "active-tab" : ""}`}
      >
        <img src={icon} className="me-2 img-20" alt={alt}/>
        <span className="text-black">{label}</span>
      </button>
    </Link>
  );
};

// Navigation items array
const navItems = [
  {href: "/dashboard", icon: images.dashboard.default.src, alt: "Dashboard", label: "Dashboard"},
  {href: "/content", icon: images.send.default.src, alt: "Content", label: "Content"},
  {href: "/update-category", icon: images.cart.default.src, alt: "Update Category", label: "Update Category"},
  {href: "/admin-panel", icon: images.headphones.default.src, alt: "Admin Panel", label: "Admin Panel"},
  {href: "/users", icon: images.user.default.src, alt: "Users", label: "Users"},
  {href: "/role-management", icon: images.command.default.src, alt: "Role Management", label: "Role Management"},
  {href: "/paid-user", icon: images.ice.default.src, alt: "Paid User", label: "Paid User"},
  {href: "/settings", icon: images.settings.default.src, alt: "Settings", label: "Settings"},
];

const Layout = ({children}) => {
  const userDetails = getUserDetails();
  return (
    <div className="layout d-flex vh-100">
      {/* Sidebar */}
      <div className="sidebar p-3">
        <div className="text-center mb-5">
          <img className="profile-pic mx-auto" src={userDetails?.image || images.default.default.src}/>
          <h5 className="py-2 mb-4">{userDetails?.name}</h5>
        </div>
        <nav className="nav flex-column">
          {navItems.map((item, index) => (
            <NavButton
              key={index}
              href={item.href}
              icon={item.icon}
              alt={item.alt}
              label={item.label}
            />
          ))}
        </nav>
      </div>

      {/* Vertical Divider */}
      <div className="divider bg-gray rounded"></div>

      {/* Main Content Area */}
      <div className="main-content flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
