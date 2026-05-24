import { useState } from 'react';
import { api } from '../api/api';
import DataTable from '../components/DataTable';
import FormModal, { FieldDef } from '../components/FormModal';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import { useResource } from '../hooks/useResource';

type ExperienceRow = Record<string, unknown>;

const FIELDS: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'organization', label: 'Organization', type: 'text', required: true },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    options: [
      { value: 'INDUSTRY', label: 'Industry' },
      { value: 'RESEARCH', label: 'Research' },
    ],
  },
  {
    key: 'startDate',
    label: 'Start Date',
    type: 'text',
    required: true,
    hint: 'e.g. Apr 2025',
  },
  { key: 'endDate', label: 'End Date', type: 'text', hint: 'Leave blank if current' },
  { key: 'isCurrent', label: 'Currently working here', type: 'checkbox' },
  {
    key: 'description',
    label: 'Description (bullet points)',
    type: 'tags',
  },
  { key: 'technologies', label: 'Technologies', type: 'tags' },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
];

const COLUMNS = [
  { key: 'title', header: 'Title' },
  { key: 'organization', header: 'Organization' },
  { key: 'type', header: 'Type' },
  { key: 'startDate', header: 'Start' },
  {
    key: 'isCurrent',
    header: 'Current',
    render: (row: ExperienceRow) =>
      row['isCurrent'] ? (
        <span className="rounded-full bg-green-900/50 px-2 py-0.5 text-xs text-green-400">
          Yes
        </span>
      ) : (
        <span className="text-gray-500">No</span>
      ),
  },
  { key: 'sortOrder', header: 'Order' },
];

export default function ExperiencePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const { data, total, page, limit, loading, setPage, handleSearch, refresh } =
    useResource<ExperienceRow>('/api/v1/admin/experience');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: ExperienceRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing?.id) {
      await api.put(`/api/v1/admin/experience/${editing.id}`, values);
    } else {
      await api.post('/api/v1/admin/experience', values);
    }
    refresh();
  };

  const handleDelete = async (row: ExperienceRow) => {
    if (!window.confirm('Delete this experience entry?')) return;
    await api.delete(`/api/v1/admin/experience/${row['id']}`);
    refresh();
  };

  const handleArchive = async (row: ExperienceRow) => {
    await api.patch(`/api/v1/admin/experience/${row['id']}/archive`);
    refresh();
  };

  const handleRestore = async (row: ExperienceRow) => {
    await api.patch(`/api/v1/admin/experience/${row['id']}/restore`);
    refresh();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Experience"
          description="Manage work and research experience entries"
          action={
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              + Add Experience
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
          title={editing ? 'Edit Experience' : 'Add Experience'}
          fields={FIELDS}
          initialValues={editing ?? {}}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
