import { Link, useLocation } from 'react-router-dom';
import { Menu, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import StatusBadge from './StatusBadge';
import MobileNav from './MobileNav';
import { useSiteState } from '@frontend/hooks/useSiteState';
import { KICK_CHANNEL_URL, KICK_CHAT_URL } from '@frontend/lib/constants';
import { trackKickChatClick } from '@frontend/lib/analytics';

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/clips', label: 'Клипы' },
  { to: '/formats', label: 'Форматы' },
  { to: '/game/mass-effect-legendary', label: 'Игры' },
  { to: '/about', label: 'О стриме' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { data: state } = useSiteState();

  return (
    <header className="sticky top-0 z-50 bg-bg-base/90 backdrop-blur-md border-b border-border-card">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl text-text-primary tracking-tight">
              Wizard<span className="text-primary">JIOCb</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-heading -mt-0.5">
              Stream Command Center
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-primary bg-primary-dim'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {state && <StatusBadge mode={state.currentStatusMode} />}

          <a
            href={KICK_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackKickChatClick}
            className="hidden sm:inline-flex"
          >
            <Button variant="secondary" size="sm">
              Открыть чат
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </a>

          <a href={KICK_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm">
              В ЧАТ KICK
            </Button>
          </a>

          {/* Mobile menu */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </header>
  );
}
