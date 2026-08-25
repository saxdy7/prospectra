'use client';

import { PageHeader, DemoTag } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import {
  DEMO_AGENT_LEADERBOARD,
  DEMO_ANALYTICS_OVERVIEW,
  DEMO_CALL_PATTERNS,
  DEMO_DAILY_STATS,
  DEMO_PHONE_PERFORMANCE
} from '@/lib/mock-data/analytics';

export default function AnalyticsPage() {
  const ctx = useWorkspace();
  if (!ctx) return <PageSkeleton />;

  const { data } = ctx;
  const rowTotal = Object.values(data.rows).reduce((n, r) => n + r.length, 0);
  const versionTotal = data.agents.reduce((n, a) => n + a.versions.length, 0);

  const realCounts = [
    { label: 'Tables', value: data.tables.length },
    { label: 'Rows', value: rowTotal },
    { label: 'Audiences', value: data.audiences.length },
    { label: 'Campaign drafts', value: data.campaigns.length },
    { label: 'Voice agents', value: data.agents.length },
    { label: 'Agent versions', value: versionTotal }
  ];

  const maxHour = Math.max(...DEMO_CALL_PATTERNS.byHour);
  const maxWeekday = Math.max(...DEMO_CALL_PATTERNS.byWeekday);
  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <>
      <PageHeader title="Analytics" description="What exists in the workspace, and what a connected calling pipeline would report." />

      {/* Real workspace counts */}
      <div className="pa-panel" style={{ marginBottom: 20 }}>
        <p className="pa-h3" style={{ marginBottom: 14 }}>
          Workspace — live counts
        </p>
        <div className="pa-grid pa-grid--stats" style={{ marginTop: 0 }}>
          {realCounts.map((c) => (
            <div key={c.label} className="pa-stat">
              <div className="pa-stat__value">{c.value}</div>
              <div className="pa-stat__label">{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo call analytics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <p className="pa-h3" style={{ margin: 0 }}>
          Call performance
        </p>
        <DemoTag kind="demo" label="Demo data — illustrates the report once calling connects" />
      </div>

      <div className="pa-grid pa-grid--stats" style={{ marginTop: 0, marginBottom: 20 }}>
        <div className="pa-stat">
          <div className="pa-stat__value">{DEMO_ANALYTICS_OVERVIEW.totalCalls}</div>
          <div className="pa-stat__label">Total calls</div>
        </div>
        <div className="pa-stat">
          <div className="pa-stat__value">{Math.round(DEMO_ANALYTICS_OVERVIEW.connectRate * 100)}%</div>
          <div className="pa-stat__label">Connect rate</div>
        </div>
        <div className="pa-stat">
          <div className="pa-stat__value">{Math.round(DEMO_ANALYTICS_OVERVIEW.avgDurationS / 60)}m</div>
          <div className="pa-stat__label">Avg. duration</div>
        </div>
        <div className="pa-stat">
          <div className="pa-stat__value">{DEMO_ANALYTICS_OVERVIEW.bookedMeetings}</div>
          <div className="pa-stat__label">Meetings booked</div>
        </div>
      </div>

      <div className="pa-grid pa-grid--two" style={{ marginTop: 0, marginBottom: 20 }}>
        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 14 }}>
            Daily statistics
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
            {DEMO_DAILY_STATS.map((d) => {
              const h = Math.round((d.calls / Math.max(...DEMO_DAILY_STATS.map((x) => x.calls))) * 120);
              return (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: 'var(--lp-text-faint)' }}>{d.calls}</span>
                  <span
                    style={{
                      width: '100%',
                      height: h,
                      borderRadius: 4,
                      background: 'linear-gradient(180deg, var(--lp-blue-mid), var(--lp-blue-core))'
                    }}
                  />
                  <span style={{ fontSize: 10, color: 'var(--lp-text-faint)' }}>
                    {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 14 }}>
            Call patterns
          </p>
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginBottom: 8 }}>By weekday</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60, marginBottom: 16 }}>
            {DEMO_CALL_PATTERNS.byWeekday.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ width: '100%', height: Math.round((v / maxWeekday) * 50), borderRadius: 3, background: 'var(--lp-blue-core)' }} />
                <span style={{ fontSize: 9, color: 'var(--lp-text-faint)' }}>{weekdayLabels[i]}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginBottom: 8 }}>By hour</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 40 }}>
            {DEMO_CALL_PATTERNS.byHour.map((v, i) => (
              <span key={i} style={{ flex: 1, height: Math.max(2, Math.round((v / maxHour) * 36)), borderRadius: 2, background: 'rgba(40,95,255,.5)' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="pa-grid pa-grid--two" style={{ marginTop: 0 }}>
        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 14 }}>
            Agent leaderboard
          </p>
          <div className="pa-table-scroll">
            <table className="pa-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Calls</th>
                  <th>Connect</th>
                  <th>Booked</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_AGENT_LEADERBOARD.map((a) => (
                  <tr key={a.agentName}>
                    <td style={{ color: 'var(--lp-text)' }}>{a.agentName}</td>
                    <td>{a.calls}</td>
                    <td>{Math.round(a.connectRate * 100)}%</td>
                    <td>{a.bookedMeetings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pa-panel">
          <p className="pa-h3" style={{ marginBottom: 14 }}>
            Phone performance
          </p>
          <div className="pa-table-scroll">
            <table className="pa-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Calls</th>
                  <th>Connect</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_PHONE_PERFORMANCE.map((p) => (
                  <tr key={p.e164}>
                    <td style={{ color: 'var(--lp-text)' }}>{p.label}</td>
                    <td>{p.calls}</td>
                    <td>{Math.round(p.connectRate * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
