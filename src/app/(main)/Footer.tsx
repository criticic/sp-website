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
    <footer className="border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start">
          <div>
            <p className="text-sm font-body font-medium text-ink">Students Parliament</p>
            <p className="text-xs font-mono text-slate mt-1">IIT (BHU) Varanasi</p>
            <div className="rostrum-rule my-4 max-w-40">
              ◆
            </div>
            <p className="text-xs font-mono text-slate">
              vp.parliament@itbhu.ac.in
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 border border-slate/30 text-slate hover:border-gold hover:text-gold transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
            <p className="text-xs font-mono text-slate text-right">
              &copy; {new Date().getFullYear()} Students Parliament IIT BHU
            </p>
            <p className="text-xs font-mono text-slate/60 text-right">
              Made by{' '}
              <a href="https://copsiitbhu.co.in" target="_blank" className="hover:text-gold transition-colors underline underline-offset-2 decoration-gold/30">COPS</a>
              {' '}&bull;{' '}
              <a href="https://www.sntciitbhu.co.in/" target="_blank" className="hover:text-gold transition-colors underline underline-offset-2 decoration-gold/30">SNTC</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
