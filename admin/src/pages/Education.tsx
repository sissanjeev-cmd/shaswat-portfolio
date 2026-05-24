import { useState } from 'react';
import { api } from '../api/api';
import DataTable from '../components/DataTable';
import FormModal, { FieldDef } from '../components/FormModal';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import { useResource } from '../hooks/useResource';

type EducationRow = Record<string, unknown>;

const FIELDS: FieldDef[] = [
  { key: 'institution', label: 'Institution', type: 'text' },
  { key: 'degree', label: 'Degree', type: 'text' },
  { key: 'field', label: 'Field of Study', type: 'text' },
  { key: 'startYear', label: 'Start Year', type: 'number' },
  { key: 'endYear', label: 'End Year', type: 'number' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
];

const COLUMNS = [
  { key: 'institution', header: 'Institution' },
  { key: 'degree', header: 'Degree' },
  { key: 'field', header: 'Field' },
  { key: 'startYear', header: 'Start' },
  { key: 'endYear', header: 'End' },
  { key: 'sortOrder', header: 'Order' },
];

export default function EducationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EducationRow | null>(null);
  const { data, total, page, limit, loading, setPage, handleSearch, refresh } =
    useResource<EducationRow>('/api/v1/admin/education');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: EducationRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing?.id) {
      await api.put(`/api/v1/admin/education/${editing.id}`, values);
    } else {
      await api.post('/api/v1/admin/education', values);
    }
    refresh();
  };

  const handleDelete = async (row: EducationRow) => {
    if (!window.confirm('Delete this education entry?')) return;
    await api.delete(`/api/v1/admin/education/${row['id']}`);
    refresh();
  };

  const handleArchive = async (row: EducationRow) => {
    await api.patch(`/api/v1/admin/education/${row['id']}/archive`);
    refresh();
  };

  const handleRestore = async (row: EducationRow) => {
    await api.patch(`/api/v1/admin/education/${row['id']}/restore`);
    refresh();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Education"
          description="Manage education history"
          action={
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              + Add Education
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
          title={editing ? 'Edit Education' : 'Add Education'}
          fields={FIELDS}
          initialValues={editing ?? {}}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
