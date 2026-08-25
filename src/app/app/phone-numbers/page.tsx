'use client';

import Link from 'next/link';
import { PageHeader, EmptyState, DemoTag } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';

export default function PhoneNumbersPage() {
  const ctx = useWorkspace();
  if (!ctx) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        title="Phone numbers"
        description="Numbers your voice agents call from and receive calls on."
        actions={
          <button className="pa-btn" disabled title="Connect a telephony provider to purchase a number">
            Buy a number
            <DemoTag kind="not-connected" />
          </button>
        }
      />

      <EmptyState
        icon="empty-phone-numbers"
        title="No numbers connected"
        description="Purchasing and assigning phone numbers needs a connected telephony provider (Twilio or Vonage). Connect one from Integrations, then numbers you buy appear here, ready to assign to an agent."
        action={
          <Link href="/app/integrations" className="pa-btn">
            Go to Integrations
          </Link>
        }
      />
    </>
  );
}
