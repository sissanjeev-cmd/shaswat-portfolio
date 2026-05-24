import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { useEffect } from 'react';

// Custom font-size extension built on top of TextStyle
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: { chain: any }) =>
          chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: any }) =>
          chain().setMark('textStyle', { fontSize: null }).run(),
    } as any;
  },
});

const FONT_SIZES = [
  { label: 'Small', value: '0.75em' },
  { label: 'Normal', value: null },
  { label: 'Large', value: '1.2em' },
];

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize],
    content: value || '',
    onUpdate({ editor }) {
      // Treat an empty editor as empty string
      const html = editor.isEmpty ? '' : editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[120px] px-3 py-2 text-sm text-gray-100 outline-none prose prose-invert max-w-none',
      },
    },
  });

  // Sync external value changes (e.g. when modal reopens with different record)
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? '' : editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const btnBase =
    'px-2 py-1 rounded text-xs font-medium transition-colors border';
  const active = 'bg-indigo-600 border-indigo-500 text-white';
  const inactive = 'bg-gray-800 border-gray-700 text-gray-300 hover:border-indigo-500 hover:text-white';

  const currentSize = (() => {
    const attrs = editor.getAttributes('textStyle');
    return (attrs.fontSize as string | null) ?? null;
  })();

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-700 px-2 py-1.5">
        {/* Bold */}
        <button
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btnBase} font-bold w-8 ${editor.isActive('bold') ? active : inactive}`}
        >
          B
        </button>

        <div className="h-4 w-px bg-gray-700 mx-1" />

        {/* Font Size */}
        {FONT_SIZES.map(({ label, value: size }) => (
          <button
            key={label}
            type="button"
            title={`${label} text`}
            onClick={() => {
              if (size) {
                (editor.chain().focus() as any).setFontSize(size).run();
              } else {
                (editor.chain().focus() as any).unsetFontSize().run();
              }
            }}
            className={`${btnBase} ${currentSize === size ? active : inactive}`}
          >
            {label}
          </button>
        ))}

        <div className="h-4 w-px bg-gray-700 mx-1" />

        {/* New Paragraph */}
        <button
          type="button"
          title="Insert paragraph break"
          onClick={() => editor.chain().focus().splitBlock().run()}
          className={`${btnBase} ${inactive}`}
        >
          ¶ Para
        </button>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
