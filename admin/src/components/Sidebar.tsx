import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuth } from '../store/auth';
import { api } from '../api/api';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/experience', label: 'Experience', icon: '💼' },
  { path: '/education', label: 'Education', icon: '🎓' },
  { path: '/projects', label: 'Projects', icon: '🗂️' },
  { path: '/publications', label: 'Publications', icon: '📄' },
  { path: '/skills', label: 'Skills', icon: '⚡' },
  { path: '/certifications', label: 'Certifications', icon: '🏅' },
  { path: '/awards', label: 'Awards', icon: '🏆' },
  { path: '/contact', label: 'Contact Messages', icon: '✉️' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/users', label: 'Users', icon: '👥' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/api/v1/auth/logout', {});
    } catch {
      // ignore logout errors
    }
    clearAuth();
    navigate('/login');
  };

  return (
    <aside
      className="flex h-screen w-60 flex-shrink-0 flex-col"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 border-b border-gray-800 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold">
          S
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-100">Shaswat</p>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                  }`
                }
              >
                <span className="w-5 text-center text-base leading-none">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
        >
          <span className="w-5 text-center text-base leading-none">⎋</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
