'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { preferences } from '@/lib/demo-storage/preferences';
import {
  ArrowUp,
  ChevronUp,
  History,
  LayoutGrid,
  Maximize2,
  Mic,
  Minimize2,
  Plus,
  Search,
  Send,
  Sparkles
} from 'lucide-react';
import { DemoTag } from './Tags';
import { useToast } from './Toast';

const QUICK_ACTIONS = [
  { icon: Search, label: 'Find leads', href: '/app/find-leads' },
  { icon: Send, label: 'Create campaign', href: '/app/campaigns/new' },
  { icon: Mic, label: 'Create voice agent', href: '/app/voice-agents/new' },
  { icon: LayoutGrid, label: 'All quick actions', href: '/app' }
];

/** What the assistant will actually do once connected — grouped and
    specific, not a vague pitch. Framed as capability, never as something
    that has already happened: nothing here has run yet. */
const CAPABILITIES: { group: string; items: string[] }[] = [
  {
    group: 'Sourcing & tables',
    items: [
      'Turn a sentence into a People, Company, or Local business search',
      'Land results straight into a table with columns already mapped',
      'Queue enrichment on the rows that need it'
    ]
  },
  {
    group: 'Outreach',
    items: [
      'Draft a multi-step email or WhatsApp sequence for an audience',
      'Write a voice agent’s prompt, opening line, and tool settings',
      'Hold every send for your review — nothing goes out on its own'
    ]
  },
  {
    group: 'Connections',
    items: [
      'Connect a scraping provider like Apify from a pasted API key',
      'Keep that key encrypted server-side — never visible in a prompt'
    ]
  }
];

function Capabilities() {
  return (
    <>
      <p className="pa-ai-panel__desc">
        Describe what you want — &ldquo;find 50 SaaS companies in Bangalore and email their
        founders&rdquo; — and it builds the search, table, and campaign for you.
      </p>
      <div className="pa-ai-panel__capabilities">
        {CAPABILITIES.map((group) => (
          <div key={group.group}>
            <p className="pa-ai-panel__group">{group.group}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

let historyCounter = 0;

/**
 * The global "ask Prospectra to do it" entry point — a persistent bar
 * pinned at the bottom of every `/app/*` page, not a launcher you have to
 * click to discover. Nothing here calls a model yet: it collects the
 * prompt, explains honestly what it will eventually do, and never
 * fabricates a reply — "history" is exactly what you typed this session,
 * not an invented transcript. See docs/AI_ASSISTANT_AND_BACKEND_PLAN.md for
 * what actually connecting it requires.
 */
export function AiAssistant() {
  const router = useRouter();
  // The --lp- and --pa- token families (background colours included) are
  // only defined inside the .pa class scope. createPortal(..., document.body)
  // moves this modal's DOM node to be a sibling of the .lp.pa root, not a
  // descendant — so without re-declaring that scope here, every var() lookup
  // below resolves to nothing and every background was silently rendering as
  // transparent, letting the whole real page show through no matter how much
  // !important was piled onto the rule.
  const theme = useSyncExternalStore(
    preferences.subscribeTheme,
    preferences.getTheme,
    preferences.getThemeServerSnapshot
  );
  const [expanded, setExpanded] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<{ id: number; text: string }[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { push } = useToast();

  useEffect(() => {
    if (!maximized) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMaximized(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [maximized]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    historyCounter += 1;
    const entry = { id: historyCounter, text: prompt.trim() };
    setHistory((h) => [entry, ...h]);
    setSelectedId(entry.id);
    push('Not connected yet — this will run real actions once a model provider is set up.', 'success');
    setPrompt('');
  };

  const newChat = () => {
    setPrompt('');
    setSelectedId(null);
  };

  const goTo = (href: string) => {
    setMaximized(false);
    router.push(href);
  };

  const selected = history.find((h) => h.id === selectedId);

  const toolbar = (
    <div className={`pa-ai-dock__toolbar${expanded ? ' pa-ai-dock__toolbar--attached' : ''}`}>
      {!maximized && (
        <button
          type="button"
          className="pa-ai-dock__toggle"
          aria-label={expanded ? 'Hide what Prospectra AI can do' : 'Show what Prospectra AI can do'}
          title={expanded ? 'Hide details' : 'Show what it can do'}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <History size={14} />
          <ChevronUp size={13} style={{ transform: expanded ? 'rotate(180deg)' : undefined }} />
        </button>
      )}

      <div className="pa-ai-quick-row">
        {QUICK_ACTIONS.map((a) => (
          <button key={a.href} type="button" className="pa-ai-quick" onClick={() => goTo(a.href)}>
            <a.icon size={12} strokeWidth={2} />
            {a.label}
          </button>
        ))}
      </div>

      {!maximized && (
        <>
          <button type="button" className="pa-ai-dock__toggle" aria-label="New chat" title="New chat" onClick={newChat}>
            <Plus size={15} />
          </button>
          <button
            type="button"
            className="pa-ai-dock__toggle"
            aria-label="Maximize"
            title="Maximize"
            onClick={() => setMaximized(true)}
          >
            <Maximize2 size={14} />
          </button>
        </>
      )}
    </div>
  );

  const bar = (
    <form className="pa-ai-bar" onSubmit={submit}>
      <Sparkles size={16} className="pa-ai-bar__icon" aria-hidden="true" />
      <input
        className="pa-ai-bar__input"
        placeholder="Find 50 SaaS companies in Bangalore…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button type="submit" className="pa-ai-bar__send" aria-label="Send">
        <ArrowUp size={15} strokeWidth={2.4} />
      </button>
    </form>
  );

  return (
    <>
      <div className="pa-ai-dock" style={maximized ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}>
        {expanded && (
          <div className="pa-ai-panel" role="region" aria-label="What Prospectra AI will do">
            <div className="pa-ai-panel__head">
              <div className="pa-ai-panel__head-left">
                <span className="pa-ai-panel__title">Prospectra AI</span>
                <DemoTag kind="coming-soon" />
              </div>
            </div>
            <Capabilities />
          </div>
        )}
        {toolbar}
        {bar}
      </div>

      {maximized &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="lp pa pa-ai-max" data-theme={theme} role="dialog" aria-modal="true" aria-label="Prospectra AI">
            <aside className="pa-ai-max__sidebar">
              <div className="pa-ai-max__brand">
                <Sparkles size={15} className="pa-ai-bar__icon" />
                Prospectra AI
              </div>
              <button type="button" className="pa-ai-max__new" onClick={newChat}>
                <Plus size={14} />
                New chat
              </button>
              <p className="pa-ai-max__history-label">This session</p>
              {history.length === 0 ? (
                <p className="pa-ai-max__history-empty">Nothing asked yet.</p>
              ) : (
                <ul className="pa-ai-max__history-list">
                  {history.map((h) => (
                    <li key={h.id}>
                      <button
                        type="button"
                        aria-current={selectedId === h.id ? 'page' : undefined}
                        onClick={() => setSelectedId(h.id)}
                      >
                        {h.text}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <div className="pa-ai-max__main">
              <div className="pa-ai-max__topbar">
                <span className="pa-ai-panel__title">{selected ? 'Conversation' : 'What it can do'}</span>
                <button type="button" className="pa-icon-btn" aria-label="Minimize" title="Minimize" onClick={() => setMaximized(false)}>
                  <Minimize2 size={15} />
                </button>
              </div>

              <div className="pa-ai-max__content">
                {selected ? (
                  <>
                    <p className="pa-ai-max__prompt">{selected.text}</p>
                    <div className="pa-ai-max__reply">
                      <DemoTag kind="not-connected" />
                      <p>
                        No model is connected yet, so there&apos;s no real response to show — this is
                        exactly where one would appear once a provider is set up.
                      </p>
                    </div>
                  </>
                ) : (
                  <Capabilities />
                )}
              </div>

              {toolbar}
              {bar}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
