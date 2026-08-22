import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import {
  Home,
  MapPin,
  Briefcase,
  Mic,
  Search,
  Sparkles,
  Star,
  ExternalLink,
  Phone,
  Megaphone,
  Users
} from 'lucide-react';
import { VoiceOrb } from './components/voice/VoiceOrb';
import {
  INITIAL_LOCAL_BUSINESSES,
  INITIAL_JOB_LISTINGS,
  INITIAL_VOICE_AGENTS
} from './data/mockData';
import type { VoiceAgent } from './data/mockData';

/* ==========================================================================
   Navigation
   ========================================================================== */

type ViewId = 'home' | 'businesses' | 'jobs' | 'voice';

const NAV_ITEMS: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'businesses', label: 'Local businesses', icon: MapPin },
  { id: 'jobs', label: 'Jobs & auto-apply', icon: Briefcase },
  { id: 'voice', label: 'Voice AI studio', icon: Mic }
];

const ACTION_CARDS: { title: string; body: string; color: string; target: ViewId }[] = [
  {
    title: 'Find local businesses',
    body: 'Scrape Google Maps for hotels, clinics and contractors with verified phone numbers.',
    color: 'var(--color-brand-mint)',
    target: 'businesses'
  },
  {
    title: 'Hunt jobs & auto-apply',
    body: 'Pull open roles, extract recruiter contacts and fire a tailored pitch.',
    color: 'var(--color-brand-peach)',
    target: 'jobs'
  },
  {
    title: 'Build a voice agent',
    body: 'Configure a multilingual conversational agent and test it over telephony.',
    color: 'var(--color-brand-lavender)',
    target: 'voice'
  },
  {
    title: 'Launch a campaign',
    body: 'Combine email sequences, automated voice dialing and WhatsApp triggers.',
    color: 'var(--color-brand-pink)',
    target: 'home'
  }
];

/* ==========================================================================
   Shared chrome
   ========================================================================== */

function Sidebar({
  active,
  onNavigate
}: {
  active: ViewId;
  onNavigate: (view: ViewId) => void;
}) {
  return (
    <nav
      style={{
        width: 248,
        flexShrink: 0,
        borderRight: '1px solid var(--color-hairline)',
        backgroundColor: 'var(--color-surface-soft)',
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background:
              'linear-gradient(135deg, var(--color-brand-ochre), var(--color-brand-pink))'
          }}
        />
        <span className="text-title-sm">Clay Clone</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={clsx('text-body-sm')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'var(--font-family)',
              fontWeight: active === id ? 600 : 400,
              color: active === id ? 'var(--color-ink)' : 'var(--color-body)',
              backgroundColor: active === id ? 'var(--color-surface-strong)' : 'transparent'
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-hairline)'
          }}
        >
          <div className="text-caption-uppercase" style={{ color: 'var(--color-muted)' }}>
            Credits
          </div>
          <div className="text-title-sm" style={{ marginTop: 4 }}>
            2,400 enrichment
          </div>
          <div className="text-body-sm" style={{ color: 'var(--color-muted)' }}>
            $9.76 voice balance
          </div>
        </div>
      </div>
    </nav>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header style={{ marginBottom: 'var(--space-lg)' }}>
      <h1 className="text-display-sm">{title}</h1>
      <p className="text-body-md" style={{ color: 'var(--color-muted)', marginTop: 4 }}>
        {subtitle}
      </p>
    </header>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span
      className="text-caption"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--color-blue-light)',
        color: 'var(--color-blue-primary)',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </span>
  );
}

const TH: CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  borderBottom: '1px solid var(--color-hairline)',
  backgroundColor: 'var(--color-surface-soft)',
  color: 'var(--color-muted)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap'
};

const TD: CSSProperties = {
  padding: '12px 14px',
  borderBottom: '1px solid var(--color-hairline-soft)',
  fontSize: 14,
  verticalAlign: 'top'
};

/* ==========================================================================
   Views
   ========================================================================== */

function HomeView({ onNavigate }: { onNavigate: (view: ViewId) => void }) {
  const [prompt, setPrompt] = useState('');

  const stats: { icon: typeof Home; label: string; value: number }[] = [
    { icon: MapPin, label: 'Businesses scraped', value: INITIAL_LOCAL_BUSINESSES.length },
    { icon: Briefcase, label: 'Open roles tracked', value: INITIAL_JOB_LISTINGS.length },
    { icon: Users, label: 'Voice agents live', value: INITIAL_VOICE_AGENTS.length },
    {
      icon: Megaphone,
      label: 'Calls placed',
      value: INITIAL_VOICE_AGENTS.reduce((sum, a) => sum + a.totalCalls, 0)
    }
  ];

  return (
    <>
      <PageHeader
        title="Hey sandeep, ready to get started?"
        subtitle="Scrape leads, enrich them in a reactive table, then reach out by email or voice."
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-hairline)',
          backgroundColor: '#ffffff',
          marginBottom: 'var(--space-xl)'
        }}
      >
        <Sparkles size={18} color="var(--color-brand-lavender)" />
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything, or describe what you would like to do..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-family)',
            fontSize: 15,
            color: 'var(--color-ink)',
            backgroundColor: 'transparent'
          }}
        />
        <button className="btn-blue" type="button">
          Run
        </button>
      </div>

      <h2 className="text-title-md" style={{ marginBottom: 'var(--space-sm)' }}>
        Start something
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)'
        }}
      >
        {ACTION_CARDS.map((card) => (
          <button
            key={card.title}
            onClick={() => onNavigate(card.target)}
            style={{
              textAlign: 'left',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-hairline)',
              backgroundColor: card.color,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              minHeight: 132
            }}
          >
            <div className="text-title-sm">{card.title}</div>
            <div
              className="text-body-sm"
              style={{ marginTop: 6, color: 'var(--color-body-strong)' }}
            >
              {card.body}
            </div>
          </button>
        ))}
      </div>

      <h2 className="text-title-md" style={{ marginBottom: 'var(--space-sm)' }}>
        Workspace at a glance
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)'
        }}
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <div style={{ padding: 'var(--space-md)' }}>
              <Icon size={18} color="var(--color-muted)" />
              <div className="text-display-sm" style={{ marginTop: 8 }}>
                {value}
              </div>
              <div className="text-body-sm" style={{ color: 'var(--color-muted)' }}>
                {label}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function BusinessesView() {
  const [query, setQuery] = useState('');

  const rows = INITIAL_LOCAL_BUSINESSES.filter((b) =>
    (b.name + b.category + b.address).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Local businesses"
        subtitle="Google Maps scrape results, streamed into the reactive grid."
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          marginBottom: 'var(--space-md)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-hairline)',
            backgroundColor: '#ffffff',
            flex: 1,
            maxWidth: 360
          }}
        >
          <Search size={15} color="var(--color-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter rows..."
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              backgroundColor: 'transparent'
            }}
          />
        </div>
        <span className="text-body-sm" style={{ color: 'var(--color-muted)' }}>
          {rows.length} of {INITIAL_LOCAL_BUSINESSES.length} rows
        </span>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 940 }}>
            <thead>
              <tr>
                <th style={TH}>Status</th>
                <th style={TH}>Business name</th>
                <th style={TH}>Category</th>
                <th style={TH}>Phone</th>
                <th style={TH}>Address</th>
                <th style={TH}>Rating</th>
                <th style={TH}>Reviews</th>
                <th style={TH}>Links</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td style={TD}>
                    <StatusPill label={b.status} />
                  </td>
                  <td style={{ ...TD, fontWeight: 600, minWidth: 200 }}>
                    {b.name}
                    <div
                      className="text-body-sm"
                      style={{ color: 'var(--color-muted)', fontWeight: 400, marginTop: 2 }}
                    >
                      {b.description}
                    </div>
                  </td>
                  <td style={{ ...TD, color: 'var(--color-body)' }}>{b.category}</td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>
                    <a
                      href={'tel:' + b.phone.replace(/\s/g, '')}
                      style={{ color: 'var(--color-blue-primary)', textDecoration: 'none' }}
                    >
                      {b.phone}
                    </a>
                  </td>
                  <td style={{ ...TD, color: 'var(--color-body)', maxWidth: 260 }}>{b.address}</td>
                  <td style={TD}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontWeight: 600
                      }}
                    >
                      <Star
                        size={13}
                        fill="var(--color-brand-ochre)"
                        color="var(--color-brand-ochre)"
                      />
                      {b.rating.toFixed(1)}
                    </span>
                  </td>
                  <td style={{ ...TD, color: 'var(--color-body)' }}>{b.reviewsCount}</td>
                  <td style={TD}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <a
                        href={b.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Google Maps"
                        style={{ color: 'var(--color-blue-primary)' }}
                      >
                        <MapPin size={15} />
                      </a>
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noreferrer"
                        title="Website"
                        style={{ color: 'var(--color-blue-primary)' }}
                      >
                        <ExternalLink size={15} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function JobsView() {
  return (
    <>
      <PageHeader
        title="Jobs & auto-apply"
        subtitle="Scraped roles with recruiter contacts, ready for a tailored pitch."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {INITIAL_JOB_LISTINGS.map((job) => (
          <Card key={job.id}>
            <div style={{ padding: 'var(--space-md)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 'var(--space-md)',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div className="text-title-md">{job.title}</div>
                  <div
                    className="text-body-sm"
                    style={{ color: 'var(--color-muted)', marginTop: 2 }}
                  >
                    {job.company} · {job.location} · {job.postedAt}
                  </div>
                </div>
                <StatusPill label={job.appliedStatus} />
              </div>

              <div
                className="text-body-sm"
                style={{ marginTop: 'var(--space-sm)', fontWeight: 600 }}
              >
                {job.salary}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 'var(--space-sm)'
                }}
              >
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-caption"
                    style={{
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-surface-card)',
                      color: 'var(--color-body)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div
                style={{
                  marginTop: 'var(--space-md)',
                  paddingTop: 'var(--space-sm)',
                  borderTop: '1px solid var(--color-hairline-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-md)',
                  flexWrap: 'wrap'
                }}
              >
                <div className="text-body-sm" style={{ color: 'var(--color-body)' }}>
                  <strong>{job.recruiterName}</strong> · {job.recruiterEmail} ·{' '}
                  {job.recruiterPhone}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" type="button">
                    Draft pitch
                  </button>
                  <button className="btn-primary" type="button">
                    <Phone size={14} />
                    Voice apply
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function VoiceView() {
  const [selected, setSelected] = useState<VoiceAgent>(INITIAL_VOICE_AGENTS[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const meta: [string, string][] = [
    ['Model', selected.model],
    ['Voice', selected.voice],
    [
      'Languages',
      selected.secondaryLanguage
        ? selected.primaryLanguage + ' + ' + selected.secondaryLanguage
        : selected.primaryLanguage
    ],
    ['Updated', selected.lastUpdated]
  ];

  return (
    <>
      <PageHeader
        title="Voice AI studio"
        subtitle="Pick an agent, review its prompt, and test it in the webcall simulator."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 300px) 1fr',
          gap: 'var(--space-lg)',
          alignItems: 'start'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {INITIAL_VOICE_AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelected(agent)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                padding: 'var(--space-sm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor:
                  selected.id === agent.id ? 'var(--color-primary)' : 'var(--color-hairline)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-family)'
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: agent.avatarColor,
                  flexShrink: 0
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div className="text-body-sm" style={{ fontWeight: 600 }}>
                  {agent.name}
                </div>
                <div className="text-caption" style={{ color: 'var(--color-muted)' }}>
                  {agent.voice} · {agent.totalCalls} calls
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <Card>
            <div style={{ padding: 'var(--space-md)' }}>
              <div className="text-caption-uppercase" style={{ color: 'var(--color-muted)' }}>
                Role &amp; objective
              </div>
              <p className="text-body-sm" style={{ marginTop: 8, color: 'var(--color-body)' }}>
                {selected.roleObjective}
              </p>

              <div
                className="text-caption-uppercase"
                style={{ color: 'var(--color-muted)', marginTop: 'var(--space-md)' }}
              >
                First message
              </div>
              <p className="text-body-sm" style={{ marginTop: 8, color: 'var(--color-body)' }}>
                {selected.firstMessage}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-lg)',
                  marginTop: 'var(--space-md)',
                  paddingTop: 'var(--space-sm)',
                  borderTop: '1px solid var(--color-hairline-soft)'
                }}
              >
                {meta.map(([label, value]) => (
                  <div key={label}>
                    <div className="text-caption" style={{ color: 'var(--color-muted)' }}>
                      {label}
                    </div>
                    <div className="text-body-sm" style={{ fontWeight: 600 }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div
              style={{
                padding: 'var(--space-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-md)',
                backgroundColor: 'var(--color-surface-dark)'
              }}
            >
              <VoiceOrb
                isSpeaking={isSpeaking}
                size={150}
                onClick={() => setIsSpeaking((s) => !s)}
              />
              <div
                className="text-body-sm"
                style={{ color: 'var(--color-on-dark-soft)', textAlign: 'center' }}
              >
                {isSpeaking
                  ? selected.voice + ' is speaking — click the orb to end'
                  : 'Click the orb to start a simulated webcall'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
   App shell
   ========================================================================== */

export function App() {
  const [view, setView] = useState<ViewId>('home');

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
      <Sidebar active={view} onNavigate={setView} />
      <main
        style={{
          flex: 1,
          padding: 'var(--space-xl)',
          maxWidth: 1240,
          width: '100%',
          minWidth: 0
        }}
      >
        {view === 'home' && <HomeView onNavigate={setView} />}
        {view === 'businesses' && <BusinessesView />}
        {view === 'jobs' && <JobsView />}
        {view === 'voice' && <VoiceView />}
      </main>
    </div>
  );
}
