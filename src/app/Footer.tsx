import Link from 'next/link';
import { FaIdCard, FaShieldAlt, FaLock, FaQrcode, FaGithub } from 'react-icons/fa';

const footerLinks = [
  { name: "Security", icon: FaShieldAlt, href: "/security" },
  { name: "Privacy", icon: FaLock, href: "/privacy" },
  { name: "Documentation", icon: FaQrcode, href: "/docs" },
  { name: "GitHub", icon: FaGithub, href: "https://github.com/iitbhu/digital-id" },
];

export default function Footer() {
  return (
    <section className="sm:px-5">
      <div className="w-full max-w-[1240px] mx-auto">
        <div className="px-4 md:px-[15px] lg:px-[60px] bg-gray-900 text-gray-300 py-8 md:py-[55px] sm:rounded-t-[45px]">
          <div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-7 items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center space-x-3">
                  <FaIdCard className="text-blue-400 text-2xl" />
                  <div className="flex flex-col">
                    <span className="text-lg md:text-xl font-bold text-white text-center md:text-left">
                      Digital ID System
                    </span>
                    <span className="text-sm text-blue-400">
                      IIT (BHU) Varanasi
                    </span>
                  </div>
                </Link>
              </div>
              <ul className="flex gap-4 md:gap-5">
                {footerLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? "_blank" : undefined}
                        rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                        className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full hover:bg-blue-600 transition-colors"
                        aria-label={link.name}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="h-[1px] bg-gray-700 my-8 md:my-12"></div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-center md:justify-between items-center text-center md:text-left text-sm">
              <div className="text-white order-2 md:order-1">
                © {new Date().getFullYear()} Digital ID System, IIT (BHU). All rights reserved.
              </div>
              <div className="text-white order-1 md:order-2">
                Securing campus with advanced digital identity solutions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}