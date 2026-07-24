import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaXTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa6';

const socialLinks = [
  { name: "Facebook", icon: FaFacebook, href: "https://www.facebook.com/sp.iitbhu/" },
  { name: "Linkedin", icon: FaLinkedin, href: "https://www.linkedin.com/company/sp-iitbhu" },
  { name: "Twitter", icon: FaXTwitter, href: "https://x.com/sp_iitbhu_vns" },
  { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/sp.iitbhu/" },
  { name: "WhatsApp", icon: FaWhatsapp, href: "https://whatsapp.com/channel/0029VbALWk9EAKWGS3kCRN0Z" },
];

export default function Footer() {
  return (
    <section className="sm:px-5">
      <div className="w-full max-w-[1240px] mx-auto px-2 sm:px-0">
        <div className="px-4 md:px-[15px] lg:px-[60px] bg-dark text-gray-300 py-6 sm:py-8 md:py-[55px] sm:rounded-t-[45px]">
          <div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-7 items-center justify-between">
              <div className="flex items-center">
                <Link href="/">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-primary text-center md:text-left">
                    Students Parliament, IIT (BHU) Varanasi
                  </span>
                </Link>
              </div>
              <ul className="flex gap-3 md:gap-5 flex-wrap justify-center">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gray-700 rounded-full hover:bg-primary transition-colors"
                        aria-label={social.name}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="h-[1px] bg-gray-700 my-6 sm:my-8 md:my-12"></div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-center md:justify-between items-center text-center md:text-left text-xs sm:text-sm">
              <div className="text-white order-2 md:order-1">
                &copy; {new Date().getFullYear()} Students Parliament IIT BHU. All rights reserved.
              </div>
              <div className="text-white order-1 md:order-2 max-w-md md:max-w-none">
                Made with ❤️ by the
                <a href="https://copsiitbhu.co.in" target="_blank" className="underline ml-1">Club of Programmers (COPS)</a>
                &nbsp;under
                <a href="https://www.sntciitbhu.co.in/" target="_blank" className="underline ml-1">SNTC, IIT BHU</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}