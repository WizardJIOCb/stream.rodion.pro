import { KICK_CHANNEL_URL } from '@frontend/lib/constants';
import { useSiteState } from '@frontend/hooks/useSiteState';

export default function Footer() {
  const { data: state } = useSiteState();

  return (
    <footer className="border-t border-border-card bg-bg-surface/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a href={KICK_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Kick
            </a>
            <span className="text-border-card">|</span>
            <span>stream.rodion.pro</span>
          </div>

          {state?.currentAnnouncement && (
            <div className="text-sm text-primary font-heading">
              {state.currentAnnouncement}
            </div>
          )}

          <div className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} WizardJIOCb
          </div>
        </div>
      </div>
    </footer>
  );
}
