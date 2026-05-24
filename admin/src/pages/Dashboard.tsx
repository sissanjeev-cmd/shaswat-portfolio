import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api';
import Sidebar from '../components/Sidebar';

interface ListResponse {
  total: number;
  items: Record<string, unknown>[];
}

interface StatCard {
  label: string;
  path: string;
  icon: string;
  resource: string;
}

const STAT_CARDS: StatCard[] = [
  { label: 'Experience', path: '/experience', icon: '💼', resource: 'experience' },
  { label: 'Education', path: '/education', icon: '🎓', resource: 'education' },
  { label: 'Projects', path: '/projects', icon: '🗂️', resource: 'projects' },
  { label: 'Publications', path: '/publications', icon: '📄', resource: 'publications' },
  { label: 'Skills', path: '/skills', icon: '⚡', resource: 'skills' },
  { label: 'Certifications', path: '/certifications', icon: '🏅', resource: 'certifications' },
  { label: 'Awards', path: '/awards', icon: '🏆', resource: 'awards' },
];

interface ContactMessage {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  subject?: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches = STAT_CARDS.map(async (card) => {
      try {
        const res = await api.get<ListResponse>(
          `/api/v1/admin/${card.resource}?limit=1`
        );
        return { key: card.resource, total: res.total };
      } catch {
        return { key: card.resource, total: 0 };
      }
    });

    const contactFetch = api
      .get<ListResponse>('/api/v1/admin/contact?limit=5&sort=createdAt&order=desc')
      .catch(() => ({ total: 0, data: [] }));

    Promise.all([...fetches, contactFetch]).then((results) => {
      const statResults = results.slice(0, STAT_CARDS.length) as {
        key: string;
        total: number;
      }[];
      const contactResult = results[STAT_CARDS.length] as ListResponse;

      const newStats: Record<string, number> = {};
      statResults.forEach(({ key, total }) => {
        newStats[key] = total;
      });
      setStats(newStats);
      setContacts(contactResult.items as unknown as ContactMessage[]);
      const unread = (contactResult.items as unknown as ContactMessage[]).filter(
        (m) => !m.isRead
      ).length;
      setUnreadCount(unread);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Overview of your portfolio content
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-8">
              {STAT_CARDS.map((card) => (
                <Link
                  key={card.resource}
                  to={card.path}
                  className="group rounded-xl border border-gray-800 bg-gray-900 p-5 transition-all hover:border-indigo-700 hover:bg-gray-800"
                >
                  <div className="mb-3 text-2xl">{card.icon}</div>
                  <p className="text-2xl font-bold text-gray-100">
                    {stats[card.resource] ?? 0}
                  </p>
                  <p className="mt-1 text-sm text-gray-400 group-hover:text-gray-300">
                    {card.label}
                  </p>
                </Link>
              ))}

              {/* Contact card with unread badge */}
              <Link
                to="/contact"
                className="group rounded-xl border border-gray-800 bg-gray-900 p-5 transition-all hover:border-indigo-700 hover:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-2xl">✉️</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-100">
                  {contacts.length}
                </p>
                <p className="mt-1 text-sm text-gray-400 group-hover:text-gray-300">
                  Contact Messages
                </p>
              </Link>
            </div>

            {/* Recent Contact Messages */}
            {contacts.length > 0 && (
              <div className="rounded-xl border border-gray-800 bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                  <h2 className="text-sm font-semibold text-gray-100">
                    Recent Contact Messages
                  </h2>
                  <Link
                    to="/contact"
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    View all →
                  </Link>
                </div>
                <ul className="divide-y divide-gray-800">
                  {contacts.map((msg) => (
                    <li key={msg.id} className="flex items-start gap-4 px-6 py-4">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-gray-400">
                        {(msg.firstName?.[0] ?? msg.email[0] ?? '?').toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-200">
                            {[msg.firstName, msg.lastName]
                              .filter(Boolean)
                              .join(' ') || msg.email}
                          </span>
                          {!msg.isRead && (
                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                          )}
                        </div>
                        {msg.subject && (
                          <p className="text-xs text-gray-400 truncate">
                            {msg.subject}
                          </p>
                        )}
                      </div>
                      {msg.createdAt && (
                        <span className="flex-shrink-0 text-xs text-gray-600">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
