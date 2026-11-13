import { navigate } from 'astro:transitions/client';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { PaletteItem } from './palette-types';

export interface PaletteLabels {
  title: string;
  placeholder: string;
  empty: string;
  hint: string;
}

export interface PaletteApi {
  open(): void;
  toggle(): void;
}

interface Props {
  items: PaletteItem[];
  labels: PaletteLabels;
  /** Se llama una vez montado, con los controles para abrir/cerrar la paleta. */
  onReady?: (api: PaletteApi) => void;
}

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function matches(item: PaletteItem, query: string): boolean {
  const haystack = normalize(`${item.label} ${item.group} ${item.hint ?? ''} ${item.keywords ?? ''}`);
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

/**
 * Paleta de comandos (Ctrl/⌘ + K). Se monta bajo demanda desde `palette-mount.tsx`
 * la primera vez que el usuario la abre, así React no pesa en la carga inicial.
 */
export default function CommandPalette({ items, labels, onReady }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const listId = useId();

  const results = useMemo(
    () => (query.trim() ? items.filter((i) => matches(i, query)) : items),
    [items, query],
  );

  const open = useCallback(() => {
    setQuery('');
    setActive(0);
    dialogRef.current?.showModal();
    inputRef.current?.focus();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const toggle = useCallback(() => {
    if (dialogRef.current?.open) close();
    else open();
  }, [open, close]);

  useEffect(() => {
    onReady?.({ open, toggle });
  }, [onReady, open, toggle]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, listId]);

  const showToast = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  const run = (item: PaletteItem | undefined) => {
    if (!item) return;
    close();
    const { action } = item;
    switch (action.kind) {
      case 'link':
        if (action.external) window.open(action.href, '_blank', 'noopener,noreferrer');
        else void navigate(action.href);
        break;
      case 'download': {
        const a = document.createElement('a');
        a.href = action.href;
        a.download = action.filename;
        a.click();
        break;
      }
      case 'copy':
        navigator.clipboard
          ?.writeText(action.value)
          .then(() => showToast(action.toast))
          .catch(() => showToast(action.value));
        break;
      case 'theme':
        window.__theme?.toggle();
        break;
    }
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const count = results.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (count) setActive((i) => (i + 1) % count);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (count) setActive((i) => (i - 1 + count) % count);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(Math.max(0, count - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]);
    }
  };

  return (
    <>
      <dialog
        ref={dialogRef}
        aria-label={labels.title}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto mt-[12vh] w-[min(640px,calc(100%-2rem))] bg-transparent p-0 text-fg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="panel overflow-hidden shadow-2xl">
          <div className="flex items-center gap-3 border-b border-line px-4">
            <span aria-hidden="true" className="font-mono text-accent">
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
              aria-label={labels.placeholder}
              placeholder={labels.placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
              autoComplete="off"
              spellCheck={false}
              className="h-14 w-full bg-transparent font-mono text-[15px] text-fg outline-none placeholder:text-subtle"
            />
            <kbd className="rounded border border-line bg-sunken px-1.5 py-0.5 font-mono text-[11px] text-subtle">
              Esc
            </kbd>
          </div>

          <ul
            id={listId}
            role="listbox"
            aria-label={labels.title}
            className="max-h-[min(60vh,420px)] overflow-y-auto p-2"
          >
            {results.map((item, i) => {
              const showGroup = i === 0 || results[i - 1].group !== item.group;
              return (
                <li key={item.id} role="none">
                  {showGroup && (
                    <div role="presentation" className="label-mono px-3 pt-3 pb-1.5 text-[11px]">
                      {item.group}
                    </div>
                  )}
                  <div
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => run(item)}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 text-sm ${
                      i === active ? 'bg-accent-soft text-fg' : 'text-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`font-mono ${i === active ? 'text-accent' : 'text-line-strong'}`}
                      >
                        ›
                      </span>
                      {item.label}
                    </span>
                    {item.hint && <span className="truncate font-mono text-xs text-subtle">{item.hint}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
          {results.length === 0 && (
            <p role="status" className="px-5 pb-6 font-mono text-sm text-subtle">
              {labels.empty}
            </p>
          )}
          <p className="label-mono border-t border-line px-4 py-2.5 text-[11px] normal-case">{labels.hint}</p>
        </div>
      </dialog>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-line bg-elev px-4 py-2 font-mono text-sm shadow-lg transition-opacity ${
          toast ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {toast && (
          <>
            <span className="text-ok">✓</span> {toast}
          </>
        )}
      </div>
    </>
  );
}
