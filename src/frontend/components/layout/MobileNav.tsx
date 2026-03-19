import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { to: string; label: string }[];
}

export default function MobileNav({ open, onClose, links }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-bg-surface border-l border-border-card p-6 flex flex-col">
        <button onClick={onClose} className="self-end mb-6 text-text-secondary hover:text-text-primary">
          <X className="w-5 h-5" />
        </button>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card/50 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
