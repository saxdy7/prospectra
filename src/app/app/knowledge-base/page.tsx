'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { FileText, Link2, Plus, Trash2 } from 'lucide-react';
import { PageHeader, EmptyState, Drawer, ConfirmDialog, DemoTag, useToast } from '@/components/app';
import { TextField } from '@/components/app/FormControls';
import { PageSkeleton } from '@/components/app/Skeleton';
import { useWorkspace } from '@/components/app/useWorkspace';
import { newId, stamp } from '@/lib/demo-storage/store';
import { logActivity } from '@/lib/demo-storage/store';
import type { KnowledgeBaseCollection, KnowledgeBaseDocument } from '@/lib/types/models';

export default function KnowledgeBasePage() {
  const ctx = useWorkspace();
  const { push } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<'collection' | 'doc' | null>(null);
  const [name, setName] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [pendingDelete, setPendingDelete] = useState<KnowledgeBaseDocument | null>(null);

  if (!ctx) return <PageSkeleton />;

  const { workspaceId, product, persistProduct } = ctx;
  const collections = product.kbCollections;
  const activeCollection = collections.find((c) => c.id === selected) ?? collections[0];
  const docs = product.kbDocuments.filter((d) => d.collectionId === activeCollection?.id);

  const createCollection = async () => {
    const c: KnowledgeBaseCollection = { id: newId(), workspaceId, name: name.trim() || 'Untitled collection', ...stamp() };
    await persistProduct({ ...product, kbCollections: [c, ...product.kbCollections] });
    await logActivity(workspaceId, 'workspace', `Created knowledge-base collection "${c.name}"`);
    push('Collection created', 'success');
    setSelected(c.id);
    setDrawer(null);
    setName('');
  };

  const addDoc = async () => {
    if (!activeCollection) return;
    const d: KnowledgeBaseDocument = {
      id: newId(),
      collectionId: activeCollection.id,
      title: docTitle.trim() || docUrl.trim() || 'Untitled document',
      url: docUrl.trim() || undefined,
      status: 'queued',
      chunkCount: 0,
      ...stamp()
    };
    await persistProduct({ ...product, kbDocuments: [d, ...product.kbDocuments] });
    push('Document added — chunking will start once a provider is connected', 'success');
    setDrawer(null);
    setDocTitle('');
    setDocUrl('');
  };

  return (
    <>
      <PageHeader
        title="Knowledge base"
        description="Documents a voice agent can reference during a call — chunked and indexed once a provider is connected."
        actions={
          <button className="pa-btn" onClick={() => setDrawer('collection')}>
            <Plus size={15} />
            New collection
          </button>
        }
      />

      {collections.length === 0 ? (
        <EmptyState
          icon="empty-knowledge-base"
          title="No collections yet"
          description="Group related documents into a collection, then attach it to a voice agent's Tools tab."
          action={
            <button className="pa-btn" onClick={() => setDrawer('collection')}>
              <Plus size={15} />
              New collection
            </button>
          }
        />
      ) : (
        <div className="pa-grid--split" style={{ '--pa-rail': '240px', gap: 18 } as CSSProperties}>
          <div className="pa-panel" style={{ padding: 8 }}>
            {collections.map((c) => (
              <button key={c.id} className="pa-nav__item" aria-current={activeCollection?.id === c.id ? 'page' : undefined} onClick={() => setSelected(c.id)} style={{ width: '100%' }}>
                <span className="pa-nav__label">{c.name}</span>
              </button>
            ))}
          </div>

          <div className="pa-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p className="pa-h3" style={{ margin: 0 }}>
                {activeCollection?.name}
              </p>
              <button className="pa-btn pa-btn--ghost" style={{ height: 34 }} onClick={() => setDrawer('doc')}>
                <Plus size={13} />
                Add document
              </button>
            </div>

            {docs.length === 0 ? (
              <EmptyState icon="empty-knowledge-base" title="No documents" description="Upload a file or link a URL to add the first document." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {docs.map((d) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid var(--lp-line)' }}>
                    {d.url ? <Link2 size={14} color="var(--lp-blue-mid)" /> : <FileText size={14} color="var(--lp-blue-mid)" />}
                    <span style={{ flex: 1, fontSize: 'var(--lp-t-sm)', color: 'var(--lp-text)' }}>{d.title}</span>
                    <DemoTag kind="coming-soon" label="Queued" />
                    <button className="pa-icon-btn" aria-label={`Remove ${d.title}`} onClick={() => setPendingDelete(d)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Drawer
        open={drawer === 'collection'}
        onClose={() => setDrawer(null)}
        title="New collection"
        footer={
          <>
            <button className="pa-btn pa-btn--ghost" onClick={() => setDrawer(null)}>
              Cancel
            </button>
            <button className="pa-btn" onClick={createCollection}>
              Create
            </button>
          </>
        }
      >
        <TextField label="Name" placeholder="Product FAQ" value={name} onChange={(e) => setName(e.target.value)} />
      </Drawer>

      <Drawer
        open={drawer === 'doc'}
        onClose={() => setDrawer(null)}
        title="Add document"
        footer={
          <>
            <button className="pa-btn pa-btn--ghost" onClick={() => setDrawer(null)}>
              Cancel
            </button>
            <button className="pa-btn" onClick={addDoc} disabled={!docTitle.trim() && !docUrl.trim()}>
              Add
            </button>
          </>
        }
      >
        <TextField label="Title" optional value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
        <TextField label="URL" optional placeholder="https://…" value={docUrl} onChange={(e) => setDocUrl(e.target.value)} />
        <p style={{ fontSize: 'var(--lp-t-caption)', color: 'var(--lp-text-faint)' }}>
          File upload is local-only in this milestone — pasting a URL is the fastest way to try this.
        </p>
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() =>
          pendingDelete &&
          persistProduct({ ...product, kbDocuments: product.kbDocuments.filter((x) => x.id !== pendingDelete.id) })
        }
        title="Remove this document?"
        description={`"${pendingDelete?.title}" will no longer be available to any agent that references this collection.`}
        confirmLabel="Remove document"
      />
    </>
  );
}
