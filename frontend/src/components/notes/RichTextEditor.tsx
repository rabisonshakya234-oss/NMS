'use client';
import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import HardBreak from '@tiptap/extension-hard-break';
import { Markdown } from 'tiptap-markdown';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from '@/lib/font';


// Rich text editor. The note is still stored as Markdown text, so exports (Markdown / PDF)
// and the AI assistant keep working exactly as before.
interface Props {
  value: string;
  onChange: (markdown: string) => void;
  invalid?: boolean;
  placeholder?: string;
}

// Save a line break as a plain newline (the default would add a backslash), so notes written
// before this editor existed keep looking exactly the same.
const PlainHardBreak = HardBreak.extend({
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any, parent: any, index: number) {
          for (let i = index + 1; i < parent.childCount; i++) {
            if (parent.child(i).type !== node.type) { state.write('\n'); return; }
          }
        },
        parse: {},
      },
    };
  },
});

const getMarkdown = (editor: any): string => editor.storage.markdown.getMarkdown();

const Btn = ({ icon, label, active, onClick, disabled }: { icon: string; label: string; active?: boolean; onClick: () => void; disabled?: boolean }) => (
  <button type="button" className={`btn btn-sm ${active ? 'btn-primary' : 'btn-light'}`} title={label} aria-label={label} aria-pressed={!!active}
    disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
    <i className={`bi bi-${icon}`} />
  </button>
);

export default function RichTextEditor({ value, onChange, invalid = false, placeholder = 'Start writing…' }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ hardBreak: false }),
      PlainHardBreak,
      Placeholder.configure({ placeholder }),
      TextStyle,
      FontFamily,
      FontSize,
      Markdown.configure({ html: false, breaks: true, tightLists: true }),
    ],
    content: value,
    immediatelyRender: false, // avoids a server/client mismatch in Next.js
    editorProps: {
      attributes: { id: 'note-content', class: 'rte-content', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Content' },
    },
    onUpdate: ({ editor }) => onChange(getMarkdown(editor)),
  });

  // If the value is changed from outside (not by typing), show it in the editor.
  useEffect(() => {
    if (editor && value !== getMarkdown(editor)) editor.commands.setContent(value);
  }, [value, editor]);

  if (!editor) return <div className={`form-control rte-box ${invalid ? 'is-invalid' : ''}`} style={{ minHeight: '24rem' }} />;

  const chain = () => editor.chain().focus();

  return (
    <div className={`form-control rte-box p-0 ${invalid ? 'is-invalid' : ''}`}>
      <div className="rte-toolbar d-flex flex-wrap gap-1 p-2 border-bottom" role="toolbar" aria-label="Text formatting">
        <Btn icon="type-bold" label="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()} />
        <Btn icon="type-italic" label="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()} />
        <Btn icon="type-strikethrough" label="Strikethrough" active={editor.isActive('strike')} onClick={() => chain().toggleStrike().run()} />
        <select className="form-select form-select-sm rte-select" title="Font family" aria-label="Font family"
          value={editor.getAttributes('textStyle').fontFamily || ''}
          onChange={(e) => { const v = e.target.value; if (v) chain().setFontFamily(v).run(); else chain().unsetFontFamily().run(); }}>
          <option value="">Font</option>
          <option value="Arial, sans-serif" style={{ fontFamily: 'Arial, sans-serif' }}>Arial</option>
          <option value="Georgia, serif" style={{ fontFamily: 'Georgia, serif' }}>Georgia</option>
          <option value="'Times New Roman', serif" style={{ fontFamily: "'Times New Roman', serif" }}>Times New Roman</option>
          <option value="'Courier New', monospace" style={{ fontFamily: "'Courier New', monospace" }}>Courier New</option>
          <option value="Verdana, sans-serif" style={{ fontFamily: 'Verdana, sans-serif' }}>Verdana</option>
          <option value="'Trebuchet MS', sans-serif" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>Trebuchet MS</option>
        </select>
        <select className="form-select form-select-sm rte-select" title="Font size" aria-label="Font size"
          value={editor.getAttributes('textStyle').fontSize || ''}
          onChange={(e) => { const v = e.target.value; if (v) chain().setFontSize(v).run(); else chain().unsetFontSize().run(); }}>
          <option value="">Size</option>
          {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'].map((s) => (
            <option key={s} value={s}>{parseInt(s, 10)}</option>
          ))}
        </select>
        <span className="rte-sep" />
        <Btn icon="type-h1" label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => chain().toggleHeading({ level: 1 }).run()} />
        <Btn icon="type-h2" label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
        <Btn icon="type-h3" label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
        <span className="rte-sep" />
        <Btn icon="list-ul" label="Bullet list" active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()} />
        <Btn icon="list-ol" label="Numbered list" active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()} />
        <Btn icon="quote" label="Quote" active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()} />
        <span className="rte-sep" />
        <Btn icon="code" label="Inline code" active={editor.isActive('code')} onClick={() => chain().toggleCode().run()} />
        <Btn icon="code-square" label="Code block" active={editor.isActive('codeBlock')} onClick={() => chain().toggleCodeBlock().run()} />
        <Btn icon="hr" label="Divider" onClick={() => chain().setHorizontalRule().run()} />
        <span className="rte-sep" />
        <Btn icon="arrow-counterclockwise" label="Undo" disabled={!editor.can().undo()} onClick={() => chain().undo().run()} />
        <Btn icon="arrow-clockwise" label="Redo" disabled={!editor.can().redo()} onClick={() => chain().redo().run()} />
      </div>
      <EditorContent editor={editor} />

      <style>{`
        .rte-box { background: #fff; }
        .rte-select { width: auto; min-width: 5.5rem; }
        .rte-sep { width: 1px; background: rgba(0,0,0,.12); margin: 0 4px; }
        .rte-content { min-height: 22rem; padding: 1rem; outline: none; line-height: 1.7; }
        .rte-content > * + * { margin-top: .6rem; }
        .rte-content h1 { font-size: 1.7rem; font-weight: 700; }
        .rte-content h2 { font-size: 1.4rem; font-weight: 700; }
        .rte-content h3 { font-size: 1.15rem; font-weight: 700; }
        .rte-content ul, .rte-content ol { padding-left: 1.5rem; }
        .rte-content blockquote { border-left: 3px solid #cbd5e1; padding-left: .9rem; color: #475569; margin-left: 0; }
        .rte-content code { background: #f1f5f9; padding: .1rem .35rem; border-radius: 4px; font-size: .9em; }
        .rte-content pre { background: #0f172a; color: #e2e8f0; padding: .8rem 1rem; border-radius: 8px; overflow-x: auto; }
        .rte-content pre code { background: transparent; padding: 0; color: inherit; }
        .rte-content hr { margin: 1rem 0; }
        .rte-content p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #94a3b8; float: left; height: 0; pointer-events: none; }
      `}</style>
    </div>
  );
}