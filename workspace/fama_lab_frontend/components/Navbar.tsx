'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, User, LogOut, LayoutDashboard, Crown } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/artists', label: 'Artists' },
    { href: '/community', label: 'Community' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const userLinks = user?.role === 'admin' 
    ? [{ href: '/admin', label: 'Admin Panel', icon: Crown }]
    : [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-950/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold gradient-text">
              FAMA.LAB
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-dark-200 hover:text-gold-400 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-dark-100 hover:text-gold-400 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold-400" />
                  </div>
                  <span>{user?.name}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-dark-900 border border-dark-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-dark-200 hover:text-gold-400 hover:bg-dark-800"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  {userLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-4 py-2 text-dark-200 hover:text-gold-400 hover:bg-dark-800"
                    >
                      {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                      {link.label}
                    </Link>
                  ))}
                  <hr className="my-2 border-dark-700" />
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-dark-800"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="btn-ghost">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-dark-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-dark-700">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-dark-200 hover:text-gold-400 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {userLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-dark-200 hover:text-gold-400 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-dark-700" />
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/login" className="btn-ghost text-center" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
