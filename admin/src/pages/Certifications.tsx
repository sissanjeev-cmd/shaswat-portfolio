import { useState } from 'react';
import { api } from '../api/api';
import DataTable from '../components/DataTable';
import FormModal, { FieldDef } from '../components/FormModal';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import { useResource } from '../hooks/useResource';

type CertificationRow = Record<string, unknown>;

const FIELDS: FieldDef[] = [
  { key: 'name', label: 'Certification Name', type: 'text' },
  { key: 'issuer', label: 'Issuer', type: 'text' },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'url', label: 'Certificate URL', type: 'text' },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
];

const COLUMNS = [
  { key: 'name', header: 'Certification' },
  { key: 'issuer', header: 'Issuer' },
  { key: 'year', header: 'Year' },
  {
    key: 'url',
    header: 'Link',
    render: (row: CertificationRow) =>
      row['url'] ? (
        <a
          href={String(row['url'])}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 text-xs"
        >
          View
        </a>
      ) : (
        <span className="text-gray-600">—</span>
      ),
  },
  { key: 'sortOrder', header: 'Order' },
];

export default function CertificationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CertificationRow | null>(null);
  const { data, total, page, limit, loading, setPage, handleSearch, refresh } =
    useResource<CertificationRow>('/api/v1/admin/certifications');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: CertificationRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing?.id) {
      await api.put(`/api/v1/admin/certifications/${editing.id}`, values);
    } else {
      await api.post('/api/v1/admin/certifications', values);
    }
    refresh();
  };

  const handleDelete = async (row: CertificationRow) => {
    if (!window.confirm('Delete this certification?')) return;
    await api.delete(`/api/v1/admin/certifications/${row['id']}`);
    refresh();
  };

  const handleArchive = async (row: CertificationRow) => {
    await api.patch(`/api/v1/admin/certifications/${row['id']}/archive`);
    refresh();
  };

  const handleRestore = async (row: CertificationRow) => {
    await api.patch(`/api/v1/admin/certifications/${row['id']}/restore`);
    refresh();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Certifications"
          description="Manage professional certifications"
          action={
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              + Add Certification
            </button>
          }
        />
        <DataTable
          columns={COLUMNS}
          data={data}
          total={total}
          page={page}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
          onSearch={handleSearch}
          onEdit={openEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />
        <FormModal
          open={modalOpen}
          title={editing ? 'Edit Certification' : 'Add Certification'}
          fields={FIELDS}
          initialValues={editing ?? {}}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
