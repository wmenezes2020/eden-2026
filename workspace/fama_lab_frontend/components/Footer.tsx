import Link from 'next/link';
import { Music, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Artists', href: '/artists' },
      { label: 'Community', href: '/community' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Pricing', href: '/#pricing' },
    ],
    company: [
      { label: 'About Us', href: '/#about' },
      { label: 'Careers', href: '/#careers' },
      { label: 'Press', href: '/#press' },
      { label: 'Contact', href: '/#contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="bg-dark-950 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Music className="w-8 h-8 text-gold-500" />
              <span className="text-xl font-display font-bold gradient-text">
                FAMA.LAB
              </span>
            </Link>
            <p className="text-dark-400 text-sm mb-6 max-w-sm">
              The premier platform connecting artists with their fans through 
              innovative music experiences and rewarding connections.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center
                           text-dark-400 hover:text-gold-400 hover:bg-dark-700 
                           transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-dark-100 font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-dark-100 font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-dark-100 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-dark-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-dark-100 font-semibold mb-1">Stay Updated</h4>
              <p className="text-dark-400 text-sm">
                Get the latest news and updates from FAMA.LAB
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-dark-800 border border-dark-700 rounded-l-lg
                         text-dark-100 placeholder-dark-500 focus:outline-none focus:border-gold-500"
              />
              <button className="px-4 py-2 bg-gold-500 text-dark-950 font-semibold rounded-r-lg
                              hover:bg-gold-400 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-dark-800">
          <p className="text-dark-500 text-sm text-center">
            © {currentYear} FAMA.LAB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
