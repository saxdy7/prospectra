'use client';

import { useId, useRef, useState } from 'react';
import { AlertCircle, ImagePlus, Trash2 } from 'lucide-react';
import { LOGO_RULES } from '@/lib/onboarding/config';

/**
 * Optional workspace mark.
 *
 * The file is read to a data URL and kept in local state only — nothing is
 * uploaded. The size ceiling is what keeps that honest: a data URL goes
 * straight into the persisted blob, and localStorage caps out somewhere
 * around 5 MB per origin.
 *
 * TODO(backend): once storage exists, upload the File to a bucket and persist
 * the returned public URL instead of the data URL.
 */
export function WorkspaceLogoUploader({
  value,
  onChange
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  const pick = (file: File | undefined) => {
    if (!file) return;

    if (!LOGO_RULES.accept.includes(file.type as (typeof LOGO_RULES.accept)[number])) {
      setError('That file type is not supported. Use PNG, JPG, SVG or WebP.');
      return;
    }

    if (file.size > LOGO_RULES.maxBytes) {
      const kb = Math.round(file.size / 1024);
      setError(`That image is ${kb} KB. Keep it under 512 KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError(undefined);
      onChange(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.onerror = () => setError('That file could not be read. Try another.');
    reader.readAsDataURL(file);
  };

  const clear = () => {
    onChange(null);
    setError(undefined);
    /* Without this, re-picking the same file fires no change event. */
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="pa-logo">
      <span className="pa-logo__preview" data-filled={value ? 'true' : 'false'}>
        {value ? (
          /* A data URL of unknown dimensions — next/image would need a size
             it cannot know here, so a plain img is the correct element. */
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" />
        ) : (
          <ImagePlus size={20} strokeWidth={1.8} aria-hidden="true" />
        )}
      </span>

      <div className="pa-logo__actions">
        <div className="pa-logo__row">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={LOGO_RULES.accept.join(',')}
            onChange={(e) => pick(e.target.files?.[0])}
            style={{ display: 'none' }}
            aria-describedby={error ? errorId : undefined}
          />
          <button
            type="button"
            className="pa-btn pa-btn--ghost"
            style={{ height: 36 }}
            onClick={() => inputRef.current?.click()}
          >
            {value ? 'Replace image' : 'Upload image'}
          </button>

          {value && (
            <button
              type="button"
              className="pa-btn pa-btn--quiet"
              style={{ height: 36 }}
              onClick={clear}
            >
              <Trash2 size={14} strokeWidth={2} />
              Remove
            </button>
          )}
        </div>

        {error ? (
          <span className="pa-error" id={errorId} role="alert">
            <AlertCircle size={13} strokeWidth={2.2} />
            {error}
          </span>
        ) : (
          <span className="pa-logo__hint">{LOGO_RULES.label}</span>
        )}
      </div>
    </div>
  );
}
