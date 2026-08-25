'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageHeader, useToast } from '@/components/app';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { CsvImport, type CsvImportSummary } from '@/components/workspace/tables/CsvImport';
import { newId } from '@/lib/workspace/store';
import type { DemoRow, DemoTable } from '@/lib/workspace/store';
import { logActivity } from '@/lib/demo-storage/store';

export default function NewImportPage() {
  const router = useRouter();
  const ctx = useWorkspace();
  const { push } = useToast();

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, data, persistData } = ctx;

  const handleImported = async (table: DemoTable, rows: DemoRow[], summary: CsvImportSummary) => {
    await persistData({
      ...data,
      tables: [...data.tables, table],
      rows: { ...data.rows, [table.id]: rows },
      importJobs: [
        ...data.importJobs,
        {
          id: newId(),
          workspaceId,
          tableId: table.id,
          filePath: summary.fileName,
          mapping: summary.mapping,
          status: 'completed',
          rowCounts: summary.rowCounts,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    });
    await logActivity(
      workspaceId,
      'table',
      `Imported ${summary.rowCounts.imported} rows from ${summary.fileName}`,
      `${summary.rowCounts.duplicate} duplicates, ${summary.rowCounts.invalid} invalid skipped`
    );
    push(`Imported ${summary.rowCounts.imported} rows into "${table.name}"`, 'success');
    router.push(`/app/tables/${table.id}`);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Imports', href: '/app/imports' }, { label: 'New import' }]}
        title="Import a CSV"
        description="Map your columns once — Prospectra flags duplicates and invalid rows before anything lands in a table."
        actions={
          <button className="pa-btn pa-btn--ghost" onClick={() => router.push('/app/imports')}>
            <ArrowLeft size={15} />
            Imports
          </button>
        }
      />

      <CsvImport
        workspaceId={workspaceId}
        onCancel={() => router.push('/app/imports')}
        onImported={handleImported}
      />
    </>
  );
}
