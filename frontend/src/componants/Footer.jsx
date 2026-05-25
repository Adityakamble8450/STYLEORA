import React from 'react'
import { Link } from 'react-router'
import { Globe, MessageCircle, Music, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', to: '/' },
    { label: 'Men\'s Collection', to: '/' },
    { label: 'Women\'s Collection', to: '/' },
    { label: 'Kids', to: '/' },
    { label: 'Accessories', to: '/' },
    { label: 'Sale', to: '/' },
  ],
  Account: [
    { label: 'My Profile', to: '/profile' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Cart', to: '/cart' },
    { label: 'Seller Dashboard', to: '/seller/dashboard' },
  ],
  Support: [
    { label: 'Contact Us', to: '/' },
    { label: 'Track Order', to: '/' },
    { label: 'Returns & Exchanges', to: '/' },
    { label: 'Size Guide', to: '/' },
    { label: 'FAQ', to: '/' },
  ],
  Company: [
    { label: 'About Stylore', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Press', to: '/' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
}

const socialLinks = [
  { Icon: Globe, label: 'Website', href: '#' },
  { Icon: MessageCircle, label: 'Community', href: '#' },
  { Icon: Music, label: 'Music / Media', href: '#' },
]

const Footer = () => {
  return (
    <footer className="bg-[#1a1411] text-white/75 mt-auto">
      {/* Newsletter strip */}
      <div className="border-b border-white/8">
        <div className="container-luxury py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label-overline text-amber-400/80 mb-2">Stay in the loop</p>
              <h3 className="font-serif text-3xl text-white leading-tight">
                Curated drops, exclusive<br className="hidden sm:block" /> previews & style edits
              </h3>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 w-full rounded-xl bg-white/8 border border-white/12 pl-10 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-amber-500/50 focus:bg-white/10 transition"
                  aria-label="Email address for newsletter"
                />
              </div>
              <button
                type="submit"
                className="btn-gold h-12 rounded-xl whitespace-nowrap text-sm"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="container-luxury py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand column */}
          <div>
            <Link to="/" className="inline-block">
              <div className="font-serif text-3xl tracking-[0.08em] text-white">STYLORE</div>
              <div className="text-xs tracking-[0.34em] text-white/40 uppercase">Maki</div>
            </Link>
            <p className="mt-5 text-sm leading-7 text-white/55 max-w-[220px]">
              A curated fashion marketplace for those who dress with intention. Premium quality, elevated taste.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/50">
              <a href="tel:+918000000000" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Phone size={13} /> +91 80000 00000
              </a>
              <a href="mailto:hello@stylore.in" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Mail size={13} /> hello@stylore.in
              </a>
              <span className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 shrink-0" /> Mumbai, Maharashtra, India
              </span>
            </div>
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/50 transition hover:border-amber-500/40 hover:text-amber-400 hover:bg-white/5"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white/90 mb-5 tracking-wide">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/50 hover:text-amber-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-luxury flex flex-col gap-3 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stylore Maki. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <span className="text-amber-500 mx-1">♥</span>
            <span>for the fashion-forward.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="hover:text-amber-400 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-amber-400 transition-colors">Terms</a>
            <a href="/" className="hover:text-amber-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
