import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/api';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';

interface ProfileData {
  name?: string;
  email?: string;
  location?: string;
  availability?: string;
  availabilityText?: string;
  focus?: string;
  bio?: string[];
  heroHeadline?: string;
  heroSubtext?: string;
  footerTagline?: string;
  yearsExp?: number | string;
  publications?: number | string;
  projects?: string;
  awards?: number | string;
  linkedinUrl?: string;
  githubUrl?: string;
  [key: string]: unknown;
}

function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="min-h-[3rem] rounded-lg border border-gray-700 bg-gray-800 px-2 py-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-900/60 px-2 py-1 text-xs text-indigo-200 max-w-full"
          >
            <span className="truncate max-w-xs">{tag}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              className="ml-0.5 flex-shrink-0 text-indigo-400 hover:text-indigo-100"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder ?? 'Type and press Enter...'}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-100 placeholder-gray-600 outline-none"
        />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api
      .get<ProfileData>('/api/v1/admin/profile')
      .then((data) => setProfile(data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: string, val: unknown) => {
    setProfile((prev) => ({ ...prev, [key]: val }));
    setSuccess(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put('/api/v1/admin/profile', profile);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
  const labelClass = 'mb-1.5 block text-sm font-medium text-gray-300';

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Profile"
          description="Manage your portfolio profile information"
        />

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Basic Info
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    value={(profile.name as string) ?? ''}
                    onChange={(e) => set('name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={(profile.email as string) ?? ''}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    value={(profile.location as string) ?? ''}
                    onChange={(e) => set('location', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Availability Status</label>
                  <input
                    type="text"
                    value={(profile.availability as string) ?? ''}
                    onChange={(e) => set('availability', e.target.value)}
                    placeholder="e.g. Open to Roles"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Availability Description</label>
                  <textarea
                    rows={2}
                    value={(profile.availabilityText as string) ?? ''}
                    onChange={(e) => set('availabilityText', e.target.value)}
                    placeholder="e.g. ML Engineering, Robotics Research — full-time or research collaborations in Toronto and remote."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Focus / Specialisation</label>
                  <input
                    type="text"
                    value={(profile.focus as string) ?? ''}
                    onChange={(e) => set('focus', e.target.value)}
                    placeholder="e.g. Safe RL · Robotics"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Footer Tagline</label>
                  <input
                    type="text"
                    value={(profile.footerTagline as string) ?? ''}
                    onChange={(e) => set('footerTagline', e.target.value)}
                    placeholder="e.g. ML Engineer · Robotics Researcher · Toronto"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Hero Content
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Hero Headline</label>
                  <input
                    type="text"
                    value={(profile.heroHeadline as string) ?? ''}
                    onChange={(e) => set('heroHeadline', e.target.value)}
                    placeholder="e.g. From Code to Intelligent Machines — Building the Future with Robotics & AI"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero Subtext</label>
                  <textarea
                    rows={3}
                    value={(profile.heroSubtext as string) ?? ''}
                    onChange={(e) => set('heroSubtext', e.target.value)}
                    placeholder="Short description shown below the hero headline..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Bio
              </h2>
              <label className={labelClass}>
                Bio Paragraphs
                <span className="ml-2 text-xs font-normal text-gray-500">
                  (each chip = one paragraph)
                </span>
              </label>
              <TagsInput
                value={Array.isArray(profile.bio) ? (profile.bio as string[]) : []}
                onChange={(v) => set('bio', v)}
                placeholder="Type a paragraph and press Enter..."
              />
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Years of Experience</label>
                  <input
                    type="number"
                    value={(profile.yearsExp as string | number) ?? ''}
                    onChange={(e) =>
                      set('yearsExp', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Publications Count</label>
                  <input
                    type="number"
                    value={(profile.publications as string | number) ?? ''}
                    onChange={(e) =>
                      set(
                        'publications',
                        e.target.value === '' ? '' : Number(e.target.value)
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Projects</label>
                  <input
                    type="text"
                    value={(profile.projects as string) ?? ''}
                    onChange={(e) => set('projects', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Awards Count</label>
                  <input
                    type="number"
                    value={(profile.awards as string | number) ?? ''}
                    onChange={(e) =>
                      set('awards', e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Social Links
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input
                    type="url"
                    value={(profile.linkedinUrl as string) ?? ''}
                    onChange={(e) => set('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>GitHub URL</label>
                  <input
                    type="url"
                    value={(profile.githubUrl as string) ?? ''}
                    onChange={(e) => set('githubUrl', e.target.value)}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-800 bg-green-900/30 px-4 py-3 text-sm text-green-300">
                Profile saved successfully.
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
