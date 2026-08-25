'use client';

import { useRouter } from 'next/navigation';
import { Briefcase, Building2, Copy, MapPin, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';

const KINDS: { href: string; icon: LucideIcon; title: string; desc: string; count: (n: Record<string, number>) => number }[] = [
  {
    href: '/app/find-leads/local-businesses',
    icon: MapPin,
    title: 'Local businesses',
    desc: 'Search by category, place and radius — restaurants, clinics, studios, shops.',
    count: (n) => n.local_business ?? 0
  },
  {
    href: '/app/find-leads/companies',
    icon: Building2,
    title: 'Companies',
    desc: 'Filter by industry, size, location, keywords and technology.',
    count: (n) => n.company ?? 0
  },
  {
    href: '/app/find-leads/people',
    icon: Users,
    title: 'People',
    desc: 'Filter by role, seniority, department, company and location.',
    count: (n) => n.people ?? 0
  },
  {
    href: '/app/find-leads/jobs',
    icon: Briefcase,
    title: 'Jobs',
    desc: 'Find open roles by title, location, remote preference and skills.',
    count: (n) => n.job ?? 0
  },
  {
    href: '/app/find-leads/lookalikes',
    icon: Copy,
    title: 'Lookalikes',
    desc: 'Start from a company you already like and find more like it.',
    count: (n) => n.lookalike ?? 0
  }
];

export default function FindLeadsHubPage() {
  const router = useRouter();
  const ctx = useWorkspace();

  if (!ctx) return <PageSkeleton />;

  const counts: Record<string, number> = {};
  for (const j of ctx.data.searchJobs) counts[j.kind] = (counts[j.kind] ?? 0) + 1;

  return (
    <>
      <PageHeader
        title="Find leads"
        description="Every search saves as a draft — nothing runs until a data provider is connected, but the row every provider will fill is already there."
      />

      <div className="pa-grid pa-grid--two">
        {KINDS.map((k) => (
          <button
            key={k.href}
            type="button"
            className="pa-panel"
            style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}
            onClick={() => router.push(k.href)}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(40,95,255,.12)',
                color: 'var(--lp-blue-mid)'
              }}
            >
              <k.icon size={19} strokeWidth={1.9} />
            </span>
            <div>
              <p className="pa-h3">{k.title}</p>
              <p style={{ marginTop: 4, fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text-faint)', lineHeight: 1.5 }}>
                {k.desc}
              </p>
            </div>
            <span style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)', marginTop: 'auto' }}>
              {k.count(counts)} saved search{k.count(counts) === 1 ? '' : 'es'}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
