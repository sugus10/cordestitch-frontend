"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  User,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  Package,
  Receipt,
  ListOrdered,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useAuthentication } from "@/app/services/auth.service";
import { useSelector } from "react-redux";
import { selectAuth } from "./redux/auth/authSlice";
import { useLoginModal } from "@/app/context/login-context";
import { useRouter } from "next/navigation";
import LoginModal from "./login/loginModal";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Button } from "./ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isMobileProductsExpanded, setIsMobileProductsExpanded] =
    useState(false);
  const { open, setOpen } = useLoginModal();
  const auth = useSelector(selectAuth);

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!auth.isAuthenticated) {
      e.preventDefault();
      setOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const router = useRouter();

  const handleProductsClick = () => {
    // You can add additional logic here if needed
    setIsMobileProductsExpanded(!isMobileProductsExpanded);
  };
  const [cartLength, setCartLength] = useState(0);
  useEffect(() => {
    const storedLength = sessionStorage.getItem("cartLength");
    if (storedLength) {
      setCartLength(parseInt(storedLength, 10));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <LoginModal />

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 shadow-lg bg-gray-50 pl-6 pr-6 pt-4 pb-4`}
      >
        <div className="">
          <div className="flex justify-between items-center ">
            <div className="flex items-center">
              <Link href="/" className="inline-block">
                <img src="/new.png" alt="CordeStitch Logo" className="w-32" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
              >
                Home
              </Link>

              {/* Products dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsProductsHovered(true)}
                onMouseLeave={() => setIsProductsHovered(false)}
              >
                <div className="flex items-center space-x-1 cursor-pointer">
                  <Link
                    href="/products"
                    className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
                  >
                    All Products
                  </Link>
                </div>
              </div>

              <Link
                href="/products"
                className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
              >
                Customize
              </Link>
              <Link
                href="/about"
                className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                aria-label="Search"
                className="text-[#3b3b3b] hover:text-brand-accent transition-colors"
              >
                <Search size={22} />
              </button>
              <div className="relative group">
                <button
                  aria-label="Orders"
                  onClick={(e) => {
                    if (!auth.isAuthenticated) {
                      e.preventDefault();
                      setOpen(true); // open login modal
                    } else {
                      router.push("/myorders");
                    }
                  }}
                  className="text-[#3b3b3b] mt-2 hover:text-brand-accent transition-colors"
                >
                  <ShoppingBag size={22} />
                </button>
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  My Orders
                </div>
              </div>
              <button
                aria-label="Account"
                className="text-[#3b3b3b] hover:text-brand-accent transition-colors cursor-pointer"
                onClick={(e) => {
                  if (!auth.isAuthenticated) {
                    e.preventDefault();
                    setOpen(true);
                  } else {
                    router.push("/profile");
                  }
                }}
              >
                <User size={22} />
              </button>

              <Link
                href="/my-cart"
                aria-label="Cart"
                className="relative text-[#3b3b3b] hover:text-brand-accent transition-colors"
              >
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-[#3b3b3b] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartLength}
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#3b3b3b]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Mobile Products dropdown */}
                <div className="flex flex-col">
                  <div
                    className="flex items-center justify-between font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors cursor-pointer"
                    onClick={handleProductsClick}
                  >
                    <span>All Products</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isMobileProductsExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isMobileProductsExpanded && (
                    <div className="pl-4 mt-2 space-y-2">
                      <Link
                        href="/products"
                        className="block py-1 text-[#3b3b3b] hover:text-brand-accent transition-colors"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileProductsExpanded(false);
                        }}
                      >
                        T-shirts
                      </Link>
                      <Link
                        href="/pants"
                        className="block py-1 text-[#3b3b3b] hover:text-brand-accent transition-colors"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileProductsExpanded(false);
                        }}
                      >
                        Pants
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/customize"
                  className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Customize
                </Link>
                <Link
                  href="/about"
                  className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="font-medium text-[#3b3b3b] hover:text-brand-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>
              <div className="mt-4 flex items-center space-x-6">
                <button
                  aria-label="Search"
                  className="text-[#3b3b3b] hover:text-brand-accent transition-colors"
                >
                  <Search size={22} />
                </button>

                {/* Orders link with tooltip on hover */}
                <div className="relative group">
                  <Link
                    href="/myorders"
                    aria-label="Orders"
                    className="text-[#3b3b3b] hover:text-brand-accent transition-colors"
                  >
                    <Package size={22} /> {/* Or use another icon if desired */}
                  </Link>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    My Orders
                  </div>
                </div>

                <Link
                  href="/profile"
                  aria-label="Account"
                  className="text-[#3b3b3b] hover:text-brand-accent transition-colors"
                  onClick={(e) => {
                    if (!auth.isAuthenticated) {
                      e.preventDefault();
                      setOpen(true);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User size={22} />
                </Link>

                <Link
                  href="/cart"
                  aria-label="Cart"
                  className="relative text-[#3b3b3b] hover:text-brand-accent transition-colors"
                >
                  <ShoppingCart size={22} />
                  <span className="absolute -top-2 -right-2 bg-[#3b3b3b] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    0
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-[#161616] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link href="/" className="group">
                <img
                  src="/newWhite.png"
                  alt="CordeStitch Logo"
                  className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed">
                Customize your style with our premium quality T-shirts. Express
                yourself through unique designs created just for you.
              </p>
              <div className="flex space-x-5">
                {[
                  { icon: <FaFacebook size={20} />, name: "Facebook" },
                  { icon: <FaInstagram size={20} />, name: "Instagram" },
                  { icon: <FaTwitter size={20} />, name: "Twitter" },
                  { icon: <FaYoutube size={20} />, name: "Youtube" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "/" },
                  { name: "All Products", href: "/products" },
                  { name: "Customize", href: "/customize" },
                  { name: "About Us", href: "/about" },
                  { name: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm inline-block relative group"
                    >
                      {link.name}
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white tracking-wide">
                Support
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "FAQs", href: "/profile/faqs" },
                  { name: "Shipping Policy", href: "/privacy" },
                  { name: "Return Policy", href: "/privacy" },
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Terms & Conditions", href: "/terms" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm inline-block relative group"
                    >
                      {link.name}
                      <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Contact Us</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex">
                  <MapPin size={20} className="shrink-0 mr-3 text-gray-500" />
                  <span>
                    584, 1st floor, RD Rajanna Complex,
                    <br />
                    Rajanukunte, Yelahanka Taluk,
                    <br />
                    Bengaluru North 560064
                  </span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="shrink-0 mr-3 text-gray-500" />
                  <a
                    href="mailto:info@cordestitch.com"
                    className="hover:text-white transition-colors duration-300"
                  >
                    info@cordestitch.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="shrink-0 mr-3 text-gray-500" />
                  <a
                    href="tel:+917349368311"
                    className="hover:text-white transition-colors duration-300"
                  >
                    +91 7349368311
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} CordeStitch. All rights
                reserved.
              </p>
              <div className="flex items-center space-x-6">
                <p className="text-gray-400 text-sm">
                  Powered by Seabed2Crest Technologies Private Limited
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
