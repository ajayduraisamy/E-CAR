import { Facebook, Github, Instagram, Linkedin } from 'lucide-react';

// Socials
const socials = [
  { icon: Github, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Facebook, href: '#' }
];

// Footer
function Footer() {
  return (
    <footer className="mt-20 border-t border-white/20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <h3 className="text-2xl font-bold text-white">Vehicle Vault (E-CAR)</h3>
          <p className="mt-3 max-w-md text-sm text-slate-300">
            A modern platform for car comparison, marketplace listings, and secure purchase flow.
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Follow Us</p>
            <div className="mt-3 flex gap-3">
              {socials.map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="rounded-2xl border border-slate-700 bg-white/5 p-2.5 text-slate-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">(c) {new Date().getFullYear()} E-CAR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Export the Footer component as default
export default Footer;
