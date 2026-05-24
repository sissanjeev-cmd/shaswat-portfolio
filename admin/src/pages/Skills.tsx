import { useState } from 'react';
import { api } from '../api/api';
import DataTable from '../components/DataTable';
import FormModal, { FieldDef } from '../components/FormModal';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import { useResource } from '../hooks/useResource';

type SkillRow = Record<string, unknown>;

const FIELDS: FieldDef[] = [
  { key: 'name', label: 'Skill Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  {
    key: 'proficiency',
    label: 'Proficiency (0–100)',
    type: 'number',
    hint: 'Enter a value between 0 and 100',
  },
  {
    key: 'level',
    label: 'Level',
    type: 'select',
    options: [
      { value: 'Beginner', label: 'Beginner' },
      { value: 'Elementary', label: 'Elementary' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Advanced', label: 'Advanced' },
      { value: 'Expert', label: 'Expert' },
    ],
  },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
];

const COLUMNS = [
  { key: 'name', header: 'Skill' },
  { key: 'category', header: 'Category' },
  {
    key: 'proficiency',
    header: 'Proficiency',
    render: (row: SkillRow) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 rounded-full bg-gray-700">
          <div
            className="h-1.5 rounded-full bg-indigo-500"
            style={{ width: `${Math.min(100, Number(row['proficiency']) || 0)}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{String(row['proficiency'] ?? 0)}%</span>
      </div>
    ),
  },
  { key: 'level', header: 'Level' },
  { key: 'sortOrder', header: 'Order' },
];

export default function SkillsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SkillRow | null>(null);
  const { data, total, page, limit, loading, setPage, handleSearch, refresh } =
    useResource<SkillRow>('/api/v1/admin/skills');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: SkillRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing?.id) {
      await api.put(`/api/v1/admin/skills/${editing.id}`, values);
    } else {
      await api.post('/api/v1/admin/skills', values);
    }
    refresh();
  };

  const handleDelete = async (row: SkillRow) => {
    if (!window.confirm('Delete this skill?')) return;
    await api.delete(`/api/v1/admin/skills/${row['id']}`);
    refresh();
  };

  const handleArchive = async (row: SkillRow) => {
    await api.patch(`/api/v1/admin/skills/${row['id']}/archive`);
    refresh();
  };

  const handleRestore = async (row: SkillRow) => {
    await api.patch(`/api/v1/admin/skills/${row['id']}/restore`);
    refresh();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Skills"
          description="Manage technical skills and proficiency levels"
          action={
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              + Add Skill
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
          title={editing ? 'Edit Skill' : 'Add Skill'}
          fields={FIELDS}
          initialValues={editing ?? {}}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
