import { useState } from 'react';
import { api } from '../api/api';
import DataTable from '../components/DataTable';
import FormModal, { FieldDef } from '../components/FormModal';
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import { useResource } from '../hooks/useResource';

type ProjectRow = Record<string, unknown>;

const FIELDS: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'organization', label: 'Organization', type: 'text' },
  { key: 'year', label: 'Year', type: 'text' },
  { key: 'featured', label: 'Featured project', type: 'checkbox' },
  { key: 'iconEmoji', label: 'Icon Emoji (e.g. 🤖)', type: 'text' },
  { key: 'imageUrl', label: 'Image URL (thumbnail)', type: 'text' },
  { key: 'description', label: 'Description', type: 'richtext' },
  { key: 'technologies', label: 'Technologies', type: 'tags' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
  { key: 'paperUrl', label: 'Paper URL', type: 'text' },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
];

const COLUMNS = [
  { key: 'title', header: 'Title' },
  { key: 'organization', header: 'Organization' },
  { key: 'year', header: 'Year' },
  {
    key: 'featured',
    header: 'Featured',
    render: (row: ProjectRow) =>
      row['featured'] ? (
        <span className="rounded-full bg-purple-900/50 px-2 py-0.5 text-xs text-purple-400">
          Yes
        </span>
      ) : (
        <span className="text-gray-500">No</span>
      ),
  },
  { key: 'sortOrder', header: 'Order' },
];

export default function ProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const { data, total, page, limit, loading, setPage, handleSearch, refresh } =
    useResource<ProjectRow>('/api/v1/admin/projects');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: ProjectRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing?.id) {
      await api.put(`/api/v1/admin/projects/${editing.id}`, values);
    } else {
      await api.post('/api/v1/admin/projects', values);
    }
    refresh();
  };

  const handleDelete = async (row: ProjectRow) => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/api/v1/admin/projects/${row['id']}`);
    refresh();
  };

  const handleArchive = async (row: ProjectRow) => {
    await api.patch(`/api/v1/admin/projects/${row['id']}/archive`);
    refresh();
  };

  const handleRestore = async (row: ProjectRow) => {
    await api.patch(`/api/v1/admin/projects/${row['id']}/restore`);
    refresh();
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <PageHeader
          title="Projects"
          description="Manage portfolio projects"
          action={
            <button
              onClick={openCreate}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              + Add Project
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
          title={editing ? 'Edit Project' : 'Add Project'}
          fields={FIELDS}
          initialValues={editing ?? {}}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
