import { Flame, Menu, Signal, UserRound, X } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import { NavLink } from "react-router-dom";
import { calculateLevelProgress } from "../../lib/gamification";
import { useProgress } from "../../features/progress/ProgressContext";
import { Logo } from "../common/Logo";

export function AppShell({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, storageNotice, dismissStorageNotice } = useProgress();
  const level = calculateLevelProgress(state.progress.totalXp);

  const navItems = [
    { to: "/", label: "Archive" },
    { to: "/tracks", label: "Expeditions" },
    { to: "/profile", label: "Relic vault" },
  ];

  return (
    <div className="app-shell">
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-metrics">
          <NavLink
            className="header-metric"
            to="/profile"
            aria-label={`${state.progress.totalXp} Signal Energy`}
          >
            <Signal size={16} aria-hidden="true" />
            <span>{state.progress.totalXp}</span>
            <small>LV {level.level}</small>
          </NavLink>
          <NavLink
            className="header-metric"
            to="/profile"
            aria-label={`${state.progress.streak.currentStreak} day Pulse Chain`}
          >
            <Flame size={16} aria-hidden="true" />
            <span>{state.progress.streak.currentStreak}</span>
          </NavLink>
          <NavLink className="profile-link" to="/profile" aria-label="Open profile">
            <UserRound size={18} aria-hidden="true" />
          </NavLink>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      {storageNotice && (
        <div className="storage-notice" role="status">
          <span>{storageNotice}</span>
          <button type="button" onClick={dismissStorageNotice}>
            Dismiss
          </button>
        </div>
      )}
      {children}
      <footer className="site-footer">
        <Logo compact />
        <p>NEXUS / Living Code Archive / Static learning system</p>
        <p>Built for keyboard, touch, and curious minds.</p>
      </footer>
    </div>
  );
}
