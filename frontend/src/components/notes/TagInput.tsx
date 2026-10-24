'use client';
import { useState, type KeyboardEvent } from 'react';
import { MAX_TAGS, MAX_TAG_LENGTH } from '@/lib/config';

// Type a tag and press Enter or comma. Backspace removes the last tag.
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}

export default function TagInput({ tags, onChange, error }: TagInputProps) {
  const [text, setText] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim().slice(0, MAX_TAG_LENGTH);
    if (tag && !tags.includes(tag) && tags.length < MAX_TAGS) onChange([...tags, tag]);
    setText('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addTag(text); }
    else if (event.key === 'Backspace' && !text && tags.length) onChange(tags.slice(0, -1));
  };

  return (
    <div>
      <div className={`form-control tag-input-box ${error ? 'is-invalid' : ''}`}>
        {tags.map((tag) => (
          <span key={tag} className="badge tag-badge d-inline-flex align-items-center gap-1">
            {tag}
            <button type="button" className="btn-close" style={{ fontSize: '0.6rem' }} aria-label={`Remove tag ${tag}`}
              onClick={() => onChange(tags.filter((t) => t !== tag))} />
          </span>
        ))}
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} onBlur={() => addTag(text)}
          placeholder={tags.length ? '' : 'Add tags (press Enter)'} aria-label="Add a tag" maxLength={MAX_TAG_LENGTH} />
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
      <div className="form-text">{tags.length}/{MAX_TAGS} tags</div>
    </div>
  );
}
