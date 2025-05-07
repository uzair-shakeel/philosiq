import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // { name: "Quiz", path: "/quiz" },
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Archetypes", path: "/archetypes" },
    { name: "Quiz", path: "/quiz" },
    { name: "MindMap", path: "/mindmap" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  if (user) {
    navLinks.push({ name: "Questions", path: "/questions" });
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-4" : "bg-white/70 py-4"
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/Website header.png" alt="logo" className="h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`font-medium transition-colors duration-300 ${
                router.pathname === link.path
                  ? "text-primary-maroon border-b-2 border-primary-maroon"
                  : "text-neutral-dark hover:text-primary-maroon"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* {user ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-maroon flex items-center justify-center text-white">
                <FaUser />
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
          ) : (
            <Link href="/login" className="btn-outline">
              Login
            </Link>
          )} */}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-neutral-dark focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 py-4 px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`font-medium py-2 transition-colors duration-300 ${
                router.pathname === link.path
                  ? "text-primary-maroon"
                  : "text-neutral-dark hover:text-primary-maroon"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* {user ? (
            <div className="flex items-center space-x-2 py-2">
              <div className="h-8 w-8 rounded-full bg-primary-maroon flex items-center justify-center text-white">
                <FaUser />
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-outline inline-block text-center"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )} */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
