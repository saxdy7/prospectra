'use client';

import { PageHeader, EmptyState } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';

export default function InvoicesPage() {
  const ctx = useWorkspace();

  if (!ctx) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Invoices' }]}
        title="Invoices"
        description="Billing, subscription history, and PDF invoices — once a payment provider is connected."
      />

      <EmptyState
        icon="empty-invoices"
        title="No invoices yet"
        description="Your workspace is free during this milestone, so nothing has been billed. Invoices will appear here the moment a payment provider is connected and a plan is active."
      />
    </>
  );
}
