import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EMPTY_TASK = { title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'To Do' };

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(EMPTY_TASK);
  const [search, setSearch] = useState('');

  const canManage = ['Admin', 'Project Manager'].includes(user?.role);

  const load = useCallback(async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        api.get('/api/tasks', { params: { search } }),
        canManage ? api.get('/api/users') : Promise.resolve({ data: { users: [] } }),
      ]);
      setTasks(tasksRes.data.tasks);
      setUsers(usersRes.data.users || []);
    } catch {
      toast.error('Failed to load data');
    } finally { setLoading(false); }
  }, [search, canManage]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditTask(null); setForm(EMPTY_TASK); setShowModal(true); };
  const openEdit = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate || '',
      priority: task.priority,
      status: task.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        await api.put(`/api/tasks/${editTask.id}`, form);
        toast.success('Task updated');
      } else {
        await api.post('/api/tasks', form);
        toast.success('Task created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      toast.success('Task deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const priorityColor = (p) => ({ Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' }[p]);
  const statusColor = (s) => ({ 'To Do': '#6366f1', 'In Progress': '#f59e0b', 'Completed': '#10b981' }[s]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tasks</h2>
        <div className="header-actions">
          <input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {canManage && (
            <button className="btn btn-primary" onClick={openCreate}>+ New Task</button>
          )}
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td><strong>{task.title}</strong></td>
                  <td><span className="tag" style={{ background: statusColor(task.status) }}>{task.status}</span></td>
                  <td><span className="tag" style={{ background: priorityColor(task.priority) }}>{task.priority}</span></td>
                  <td>{task.assignee?.name || '—'}</td>
                  <td>{task.dueDate || '—'}</td>
                  {canManage && (
                    <td className="actions">
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(task)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr><td colSpan={canManage ? 6 : 5} className="empty-row">No tasks found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editTask ? 'Edit Task' : 'Create Task'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option>To Do</option><option>In Progress</option><option>Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Assign To</label>
                  <select value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editTask ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
