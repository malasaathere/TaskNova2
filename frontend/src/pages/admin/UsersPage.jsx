import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import showToast from '../../components/ui/Toast';
import { UserPlus, Edit2, ShieldAlert, Eye, Power, PowerOff, UserMinus } from 'lucide-react';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Drawer States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);

  // User form states
  const [fullName, setFullName] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [deptInput, setDeptInput] = useState('Development');
  const [roleInput, setRoleInput] = useState('Collaborator');
  const [isActiveToggle, setIsActiveToggle] = useState(true);

  // Initial mock users list
  const [users, setUsers] = useState([
    { id: 'u1', name: 'System Admin', username: 'admin', email: 'admin@tms.com', phone: '+1 555-0199', role: 'Admin', department: 'Operations', status: 'Active', bio: 'Lead system administrator.' },
    { id: 'u2', name: 'Sarah Jenkins', username: 'sjenkins', email: 'manager@tms.com', phone: '+1 555-0144', role: 'Project Manager', department: 'Engineering', status: 'Active', bio: 'Agile Project Manager.' },
    { id: 'u3', name: 'Alex Rivera', username: 'arivera', email: 'collab@tms.com', phone: '+1 555-0122', role: 'Collaborator', department: 'Development', status: 'Active', bio: 'Frontend engineer.' },
    { id: 'u4', name: 'James Carter', username: 'jcarter', email: 'jcarter@tms.com', phone: '+1 555-0187', role: 'Collaborator', department: 'Development', status: 'Active', bio: 'Backend developer.' },
    { id: 'u5', name: 'Elena Rostova', username: 'erostova', email: 'erostova@tms.com', phone: '+1 555-0177', role: 'Project Manager', department: 'Marketing', status: 'Active', bio: 'Marketing lead.' },
    { id: 'u6', name: 'Marcus Aurelius', username: 'philosopher', email: 'marcus@tms.com', phone: '+1 555-0100', role: 'Collaborator', department: 'Design', status: 'Inactive', bio: 'UX Designer.' }
  ]);

  // Filters logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesStatus = statusFilter ? u.status === statusFilter : true;
    const matchesDept = deptFilter ? u.department === deptFilter : true;

    return matchesSearch && matchesRole && matchesStatus && matchesDept;
  });

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    // Reset Form Fields
    setFullName('');
    setUsernameInput('');
    setEmailInput('');
    setPhoneInput('');
    setDeptInput('Development');
    setRoleInput('Collaborator');
    setIsActiveToggle(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    // Populate Form Fields
    setFullName(user.name);
    setUsernameInput(user.username);
    setEmailInput(user.email);
    setPhoneInput(user.phone);
    setDeptInput(user.department);
    setRoleInput(user.role);
    setIsActiveToggle(user.status === 'Active');
    setIsModalOpen(true);
  };

  const handleOpenView = (user) => {
    setModalMode('view');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeactivate = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        showToast.info(`User "${u.name}" has been ${newStatus.toLowerCase()}d.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!fullName || !usernameInput || !emailInput) {
      showToast.error("Please fill in Name, Username, and Email fields.");
      return;
    }

    if (modalMode === 'create') {
      const newUser = {
        id: 'u-' + Date.now(),
        name: fullName,
        username: usernameInput.toLowerCase().trim(),
        email: emailInput.toLowerCase().trim(),
        phone: phoneInput || 'N/A',
        role: roleInput,
        department: deptInput,
        status: isActiveToggle ? 'Active' : 'Inactive',
        bio: 'New user added by administrator.'
      };
      setUsers([newUser, ...users]);
      showToast.success(`User "${fullName}" created successfully!`);
    } else if (modalMode === 'edit') {
      setUsers(prev => prev.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            name: fullName,
            username: usernameInput.toLowerCase().trim(),
            email: emailInput.toLowerCase().trim(),
            phone: phoneInput || 'N/A',
            role: roleInput,
            department: deptInput,
            status: isActiveToggle ? 'Active' : 'Inactive'
          };
        }
        return u;
      }));
      showToast.success(`User "${fullName}" details updated successfully!`);
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* HEADER ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>User Directory</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage role configurations and accounts</p>
        </div>
        <Button onClick={handleOpenCreate} variant="primary" style={{ height: '42px' }}>
          <UserPlus size={16} /> Create User
        </Button>
      </div>

      {/* FILTER BAR */}
      <Card style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search bar input */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <SearchBar 
              placeholder="Search by name, username or email..." 
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
            />
          </div>

          {/* Role Dropdown */}
          <select 
            className="input-field" 
            style={{ width: '150px', padding: '10px 12px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Collaborator">Collaborator</option>
          </select>

          {/* Status Dropdown */}
          <select 
            className="input-field" 
            style={{ width: '150px', padding: '10px 12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Department Dropdown */}
          <select 
            className="input-field" 
            style={{ width: '160px', padding: '10px 12px' }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Operations">Operations</option>
            <option value="Engineering">Engineering</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>

          {/* Reset Search Filters button */}
          {(searchQuery || roleFilter || statusFilter || deptFilter) && (
            <Button 
              variant="text" 
              onClick={() => { setSearchQuery(''); setRoleFilter(''); setStatusFilter(''); setDeptFilter(''); }}
              style={{ fontSize: '0.8rem', padding: '8px 12px' }}
            >
              Reset
            </Button>
          )}

        </div>
      </Card>

      {/* USERS TABLE */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Username</th>
                <th>Email Address</th>
                <th>Role Badge</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No users match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar name={user.name} size="md" glow={user.status === 'Active'} />
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</span>
                      </div>
                    </td>
                    <td className="mono-font" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      @{user.username}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <Badge type={user.role}>
                        {user.role}
                      </Badge>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.department}</td>
                    <td>
                      <Badge type={user.status === 'Active' ? 'active' : 'inactive'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="text" 
                          iconOnly 
                          title="View Profile"
                          onClick={() => handleOpenView(user)}
                        >
                          <Eye size={15} style={{ color: 'var(--text-secondary)' }} />
                        </Button>
                        <Button 
                          variant="text" 
                          iconOnly 
                          title="Edit User"
                          onClick={() => handleOpenEdit(user)}
                        >
                          <Edit2 size={15} style={{ color: 'var(--primary-accent)' }} />
                        </Button>
                        <Button 
                          variant="text" 
                          iconOnly 
                          title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                          onClick={() => handleDeactivate(user.id)}
                        >
                          {user.status === 'Active' ? (
                            <PowerOff size={15} style={{ color: 'var(--danger)' }} />
                          ) : (
                            <Power size={15} style={{ color: 'var(--success)' }} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CREATE / EDIT / VIEW SLIDE-IN MODAL DRAWER */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create' 
            ? 'Add New Team Member' 
            : modalMode === 'edit' 
              ? `Edit: ${selectedUser?.name}` 
              : `Profile: ${selectedUser?.name}`
        }
        variant="drawer"
        width="480px"
      >
        {modalMode === 'view' ? (
          // View Profile Drawer Layout
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
            <Avatar name={selectedUser?.name} size="xl" glow={selectedUser?.status === 'Active'} />
            <div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {selectedUser?.name}
              </h4>
              <p className="mono-font" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                @{selectedUser?.username}
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <Badge type={selectedUser?.role}>{selectedUser?.role}</Badge>
                <Badge type={selectedUser?.status === 'Active' ? 'active' : 'inactive'}>{selectedUser?.status}</Badge>
              </div>
            </div>

            <div style={{
              width: '100%',
              height: '1px',
              background: 'rgba(74, 144, 226, 0.15)',
              margin: '8px 0'
            }} />

            <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span className="input-label" style={{ display: 'block', marginBottom: '2px' }}>Email Address</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{selectedUser?.email}</span>
              </div>
              <div>
                <span className="input-label" style={{ display: 'block', marginBottom: '2px' }}>Phone Number</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{selectedUser?.phone}</span>
              </div>
              <div>
                <span className="input-label" style={{ display: 'block', marginBottom: '2px' }}>Department</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{selectedUser?.department}</span>
              </div>
              <div>
                <span className="input-label" style={{ display: 'block', marginBottom: '2px' }}>Short Biography</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{selectedUser?.bio || 'No bio provided.'}"
                </p>
              </div>
            </div>

            <Button 
              onClick={() => setIsModalOpen(false)} 
              variant="secondary" 
              style={{ width: '100%', marginTop: '16px' }}
            >
              Close Profile View
            </Button>
          </div>
        ) : (
          // Create/Edit Form Drawer Layout
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="input-group">
              <span className="input-label">Full Name</span>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Marcus Aurelius" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-label">Username</span>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. philosopher" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-label">Email Address</span>
              <input 
                type="email" 
                className="input-field" 
                placeholder="e.g. marcus@tms.com" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-label">Phone Number</span>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="e.g. +1 555-0100" 
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
            </div>

            <div className="input-group">
              <span className="input-label">Department</span>
              <select 
                className="input-field"
                value={deptInput}
                onChange={(e) => setDeptInput(e.target.value)}
              >
                <option value="Operations">Operations</option>
                <option value="Engineering">Engineering</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="input-group">
              <span className="input-label">System Role</span>
              <select 
                className="input-field"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Collaborator">Collaborator</option>
              </select>
            </div>

            {/* Toggle Status switch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '10px', background: 'rgba(74, 144, 226, 0.05)', border: '1px solid var(--card-border)', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>Account Status</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Toggle status as active/inactive</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActiveToggle(!isActiveToggle)}
                style={{
                  background: isActiveToggle ? 'rgba(16, 217, 160, 0.15)' : 'rgba(255, 107, 107, 0.15)',
                  border: `1px solid ${isActiveToggle ? 'var(--success)' : 'var(--danger)'}`,
                  color: isActiveToggle ? 'var(--success)' : 'var(--danger)',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isActiveToggle ? 'ACTIVE' : 'INACTIVE'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <Button type="submit" variant="primary" style={{ flex: 1 }}>
                Save User
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
