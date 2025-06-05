
// ProfileSidebar.tsx
"use client";
import Swal from 'sweetalert2';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  UserIcon, 
  MapPinIcon, 
  StarIcon, 
  CreditCardIcon, 
  HelpCircleIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUserAPIService } from '@/app/services/data.service';
import { logout } from './redux/auth/authSlice';
import { useDispatch } from 'react-redux';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, href, active, onClick }: NavItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
      active 
        ? "bg-[#3b3b3b] text-white font-medium" 
        : "text-gray-600 hover:bg-gray-100"
    )}
  >
    <span className="text-current">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const {
    
    logoutService,
  } = useUserAPIService();
  const router=useRouter();

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b3b3b",
      cancelButtonColor: "#3b3b3b",
      confirmButtonText: "Yes, Logout!",
      width: '400px',  
      customClass: {
        popup: 'custom-popup',
        title: 'custom-title',
        confirmButton: 'custom-button',
        cancelButton: 'custom-button',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await logoutService();
          if (response) {
            router.push("/");
            dispatch(logout());
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("user");
              sessionStorage.removeItem("token");
            }
  
            // Show logout success message
            Swal.fire({
              title: "Logged Out!",
              text: "Logout Successful",
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
              width: '400px', 
              customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
              },
            });
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }
      }
    });
  };
  const navigationItems = [
    { icon: <UserIcon size={20} />, label: "Personal Information", href: "/profile" },
    { icon: <MapPinIcon size={20} />, label: "Addresses", href: "/profile/addresses" },
    // { icon: <StarIcon size={20} />, label: "Loyalty Points", href: "/profile/loyaltyPoints" },
    { icon: <CreditCardIcon size={20} />, label: "Bank Details", href: "/profile/bank" },
    { icon: <HelpCircleIcon size={20} />, label: "FAQs", href: "/profile/faqs" },
  ];

  return (
    <>
      {isMobile && (
        <div className="fixed top-4 left-4 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white shadow-md text-gray-700"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      )}

      <aside
        className={cn(
          "bg-white w-72 shrink-0 border-r border-gray-200 transition-all duration-300 ease-in-out z-20",
          isMobile ? "fixed inset-y-0 left-0 transform h-full" : "relative",
          isMobile && !isMobileMenuOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#3b3b3b]">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account</p>
        </div>

        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              onClick={isMobile ? closeMobileMenu : undefined}
            />
          ))}
          
          <div className="pt-6 mt-6 border-t border-gray-200">
  <NavItem
    icon={<LogOutIcon size={20} />}
    label="Logout"
    href="#" 
    active={false}
    onClick={() => {
      if (isMobile) closeMobileMenu();
      handleLogout();
    }}
  />
</div>

        </nav>
      </aside>

      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
}
