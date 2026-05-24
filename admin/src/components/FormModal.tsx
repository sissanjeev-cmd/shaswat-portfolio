import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import RichTextEditor from './RichTextEditor';

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'tags' | 'richtext';
  options?: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
}

interface FormModalProps {
  open: boolean;
  title: string;
  fields: FieldDef[];
  initialValues?: Record<string, unknown>;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}

function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-[2.5rem] rounded-lg border border-gray-700 bg-gray-800 px-2 py-1.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-900/60 px-2 py-0.5 text-xs text-indigo-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="ml-0.5 text-indigo-400 hover:text-indigo-100"
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
          placeholder="Type and press Enter..."
          className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-100 placeholder-gray-600 outline-none"
        />
      </div>
    </div>
  );
}

export default function FormModal({
  open,
  title,
  fields,
  initialValues = {},
  onClose,
  onSubmit,
}: FormModalProps) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Reset values when modal opens
  useEffect(() => {
    if (open) {
      const defaults: Record<string, unknown> = {};
      fields.forEach((f) => {
        if (f.key in initialValues) {
          defaults[f.key] = initialValues[f.key];
        } else {
          defaults[f.key] =
            f.type === 'tags'
              ? []
              : f.type === 'checkbox'
              ? false
              : f.type === 'number'
              ? ''
              : f.type === 'richtext'
              ? ''
              : '';
        }
      });
      setValues(defaults);
      setError(null);
    }
  }, [open, initialValues, fields]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const set = (key: string, val: unknown) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                {field.label}
                {field.required && (
                  <span className="ml-1 text-red-400">*</span>
                )}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  value={(values[field.key] as string) ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  required={field.required}
                  rows={4}
                  value={(values[field.key] as string) ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  required={field.required}
                  value={(values[field.key] as string | number) ?? ''}
                  onChange={(e) =>
                    set(field.key, e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              )}

              {field.type === 'select' && field.options && (
                <select
                  required={field.required}
                  value={(values[field.key] as string) ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'checkbox' && (
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={(values[field.key] as boolean) ?? false}
                    onChange={(e) => set(field.key, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-400">
                    {field.label}
                  </span>
                </label>
              )}

              {field.type === 'tags' && (
                <TagsInput
                  value={(values[field.key] as string[]) ?? []}
                  onChange={(v) => set(field.key, v)}
                />
              )}

              {field.type === 'richtext' && (
                <RichTextEditor
                  value={(values[field.key] as string) ?? ''}
                  onChange={(v) => set(field.key, v)}
                />
              )}

              {field.hint && (
                <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
              )}
            </div>
          ))}

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
