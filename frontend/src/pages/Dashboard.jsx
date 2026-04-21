import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = '/api/v1';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTasks(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTasks = async (currentUser) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
     // console.log('Tasks:', data.data, 'User:', currentUser?.id, 'Role:', currentUser?.role);
      if (data.success) {
        setTasks(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending', priority: 'medium' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'pending', priority: 'medium' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const token = localStorage.getItem('token');
    const url = editingTask 
      ? `${API_URL}/tasks/${editingTask._id}` 
      : `${API_URL}/tasks`;
    const method = editingTask ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingTask ? 'Task updated successfully' : 'Task created successfully');
        fetchTasks();
        closeModal();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Task deleted successfully');
        fetchTasks();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

   if (loading) return <div className="loading">Loading...</div>;

   return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <Link to="/dashboard" className="navbar-brand">Task Manager</Link>
          <div className="navbar-menu">
            {user && (
              <span>Welcome, {user.username} <span className="role">{user.role}</span></span>
            )}
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="dashboard-header">
          <h1>My Tasks</h1>
          <button onClick={() => openModal()} className="btn-primary">
            + Add New Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks yet</h3>
            <p>Create your first task to get started!</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-content">
                  <h3 className="task-title">{task.title}</h3> {user && (task.user === user.id || task.user?._id === user.id) ? (
                    <span className="task-owner">{user.role === 'admin' ? '(Admin)' : 'My Task'}</span>
                  ) : (
                    <span className="task-owner">(User)</span>
                  )}
                  {task.description && <p className="task-description">{task.description}</p>}
                  <div className="task-meta">
                    <span className={`task-status ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={getPriorityClass(task.priority)}>
                      Priority: {task.priority}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <button onClick={() => openModal(task)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(task._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
   );

  }
export default Dashboard;