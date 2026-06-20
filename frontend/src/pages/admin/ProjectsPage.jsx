import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import ProgressBar from '../../components/ui/ProgressBar';
import Avatar from '../../components/ui/Avatar';
import { Calendar, User, ChevronDown, ChevronUp, CheckCircle, ClipboardList, Clock, Users as UsersIcon } from 'lucide-react';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pmFilter, setPmFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  // Accordion open state map
  const [expandedProjects, setExpandedProjects] = useState({
    p1: true, // Expand the first project by default
  });

  // Tab state per project (To Do, In Progress, Completed, Team)
  const [projectTabs, setProjectTabs] = useState({
    p1: 'todo',
    p2: 'todo',
    p3: 'todo',
    p4: 'todo',
    p5: 'todo'
  });

  // Mock project database with sub-entities
  const [projects] = useState([
    {
      id: 'p1',
      name: 'Apollo Launchpad Portal',
      manager: 'Sarah Jenkins',
      priority: 'High',
      stage: 'Execution',
      progress: 75,
      startDate: '2026-05-01',
      endDate: '2026-08-30',
      tasks: [
        { id: 't1', title: 'Verify liquid fuel telemetry API', status: 'To Do', priority: 'High', dueDate: '2026-07-10', assignee: 'James Carter' },
        { id: 't2', title: 'Stress test connection throttling', status: 'In Progress', priority: 'High', dueDate: '2026-07-15', assignee: 'Alex Rivera' },
        { id: 't3', title: 'Implement JWT refresh token interceptors', status: 'Completed', priority: 'Medium', dueDate: '2026-06-18', assignee: 'Alex Rivera' },
        { id: 't4', title: 'Set up automated backups on RDS', status: 'Completed', priority: 'High', dueDate: '2026-06-10', assignee: 'James Carter' }
      ],
      team: [
        { id: 'tm1', name: 'Sarah Jenkins', role: 'Manager', status: 'Active' },
        { id: 'tm2', name: 'Alex Rivera', role: 'Collaborator', status: 'Active' },
        { id: 'tm3', name: 'James Carter', role: 'Collaborator', status: 'Active' }
      ]
    },
    {
      id: 'p2',
      name: 'Athena Core Microservices',
      manager: 'Sarah Jenkins',
      priority: 'Medium',
      stage: 'Completed',
      progress: 100,
      startDate: '2026-01-10',
      endDate: '2026-05-20',
      tasks: [
        { id: 't5', title: 'Refactor database migration schema', status: 'Completed', priority: 'Medium', dueDate: '2026-05-15', assignee: 'James Carter' },
        { id: 't6', title: 'Create Swagger API docs', status: 'Completed', priority: 'Low', dueDate: '2026-05-20', assignee: 'Sarah Jenkins' }
      ],
      team: [
        { id: 'tm1', name: 'Sarah Jenkins', role: 'Manager', status: 'Active' },
        { id: 'tm3', name: 'James Carter', role: 'Collaborator', status: 'Active' }
      ]
    },
    {
      id: 'p3',
      name: 'Hermes Logistics Engine',
      manager: 'Elena Rostova',
      priority: 'Medium',
      stage: 'Execution',
      progress: 42,
      startDate: '2026-04-15',
      endDate: '2026-09-15',
      tasks: [
        { id: 't7', title: 'Optimize Google Maps Geocoding calls', status: 'To Do', priority: 'Medium', dueDate: '2026-07-28', assignee: 'Alex Rivera' },
        { id: 't8', title: 'Write unit tests for dispatch routing', status: 'In Progress', priority: 'High', dueDate: '2026-07-05', assignee: 'James Carter' }
      ],
      team: [
        { id: 'tm4', name: 'Elena Rostova', role: 'Manager', status: 'Active' },
        { id: 'tm2', name: 'Alex Rivera', role: 'Collaborator', status: 'Active' },
        { id: 'tm3', name: 'James Carter', role: 'Collaborator', status: 'Active' }
      ]
    },
    {
      id: 'p4',
      name: 'Titan Threat Shield VPN',
      manager: 'Sarah Jenkins',
      priority: 'High',
      stage: 'Planning',
      progress: 15,
      startDate: '2026-06-01',
      endDate: '2026-12-15',
      tasks: [
        { id: 't9', title: 'Draft network tunneling protocols specification', status: 'In Progress', priority: 'High', dueDate: '2026-07-20', assignee: 'Sarah Jenkins' }
      ],
      team: [
        { id: 'tm1', name: 'Sarah Jenkins', role: 'Manager', status: 'Active' },
        { id: 'tm5', name: 'Marcus Aurelius', role: 'Collaborator', status: 'Inactive' }
      ]
    },
    {
      id: 'p5',
      name: 'Zephyr Analytics Engine',
      manager: 'Elena Rostova',
      priority: 'Low',
      stage: 'Completed',
      progress: 100,
      startDate: '2026-02-01',
      endDate: '2026-06-01',
      tasks: [
        { id: 't10', title: 'Setup Elasticsearch aggregation indices', status: 'Completed', priority: 'Low', dueDate: '2026-05-30', assignee: 'James Carter' }
      ],
      team: [
        { id: 'tm4', name: 'Elena Rostova', role: 'Manager', status: 'Active' },
        { id: 'tm3', name: 'James Carter', role: 'Collaborator', status: 'Active' }
      ]
    }
  ]);

  // Filtering Logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPM = pmFilter ? p.manager === pmFilter : true;
    const matchesPriority = priorityFilter ? p.priority === priorityFilter : true;
    const matchesStage = stageFilter ? p.stage === stageFilter : true;

    return matchesSearch && matchesPM && matchesPriority && matchesStage;
  });

  const toggleExpand = (id) => {
    setExpandedProjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleTabChange = (projId, tab) => {
    setProjectTabs(prev => ({
      ...prev,
      [projId]: tab
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* HEADER ROW */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Projects Directory</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full access control and roadmap audit for administrators</p>
      </div>

      {/* FILTER BAR */}
      <Card style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ flex: 1, minWidth: '240px' }}>
            <SearchBar 
              placeholder="Search project name..." 
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
            />
          </div>

          {/* Project Manager Filter */}
          <select 
            className="input-field" 
            style={{ width: '180px', padding: '10px 12px' }}
            value={pmFilter}
            onChange={(e) => setPmFilter(e.target.value)}
          >
            <option value="">All Managers</option>
            <option value="Sarah Jenkins">Sarah Jenkins</option>
            <option value="Elena Rostova">Elena Rostova</option>
          </select>

          {/* Priority Filter */}
          <select 
            className="input-field" 
            style={{ width: '150px', padding: '10px 12px' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Stage Filter */}
          <select 
            className="input-field" 
            style={{ width: '160px', padding: '10px 12px' }}
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="">All Stages</option>
            <option value="Planning">Planning</option>
            <option value="Execution">Execution</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Reset Filters */}
          {(searchQuery || pmFilter || priorityFilter || stageFilter) && (
            <Button 
              variant="text" 
              onClick={() => { setSearchQuery(''); setPmFilter(''); setPriorityFilter(''); setStageFilter(''); }}
              style={{ fontSize: '0.8rem', padding: '8px 12px' }}
            >
              Reset
            </Button>
          )}

        </div>
      </Card>

      {/* EXPANDABLE ACCORDION PROJECT LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredProjects.length === 0 ? (
          <Card style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No projects found matching the filter criteria.
          </Card>
        ) : (
          filteredProjects.map(proj => {
            const isExpanded = expandedProjects[proj.id];
            const activeTab = projectTabs[proj.id] || 'todo';

            // Filter tasks based on columns
            const todoTasks = proj.tasks.filter(t => t.status === 'To Do');
            const inProgressTasks = proj.tasks.filter(t => t.status === 'In Progress');
            const completedTasks = proj.tasks.filter(t => t.status === 'Completed');

            return (
              <Card key={proj.id} style={{ padding: '0', overflow: 'hidden' }}>
                
                {/* ACCORDION HEADER */}
                <div 
                  onClick={() => toggleExpand(proj.id)}
                  style={{ 
                    padding: '24px 30px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    background: 'rgba(26, 58, 107, 0.2)',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(26, 58, 107, 0.35)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(26, 58, 107, 0.2)'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, marginRight: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{proj.name}</h4>
                      <Badge type={proj.priority.toLowerCase() === 'high' ? 'danger' : 'medium'}>{proj.priority}</Badge>
                      <Badge type={proj.stage === 'Completed' ? 'success' : 'medium'}>{proj.stage}</Badge>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <span>Manager: <strong>{proj.manager}</strong></span>
                      <span>Timeline: <strong>{proj.startDate}</strong> to <strong>{proj.endDate}</strong></span>
                    </div>
                  </div>

                  {/* Horizontal progress bar inside header */}
                  <div style={{ width: '220px', marginRight: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <ProgressBar value={proj.progress} height="6px" />
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* EXPANDED ACCORDION CONTENT */}
                {isExpanded && (
                  <div style={{ padding: '30px', borderTop: '1px solid rgba(74, 144, 226, 0.15)' }}>
                    
                    {/* ACCORDION SUB-TABS */}
                    <div className="tabs-header" style={{ marginBottom: '24px' }}>
                      <button 
                        className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
                        onClick={() => handleTabChange(proj.id, 'todo')}
                      >
                        To Do ({todoTasks.length})
                      </button>
                      <button 
                        className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
                        onClick={() => handleTabChange(proj.id, 'progress')}
                      >
                        In Progress ({inProgressTasks.length})
                      </button>
                      <button 
                        className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => handleTabChange(proj.id, 'completed')}
                      >
                        Completed ({completedTasks.length})
                      </button>
                      <button 
                        className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
                        onClick={() => handleTabChange(proj.id, 'team')}
                      >
                        Team Members ({proj.team.length})
                      </button>
                    </div>

                    {/* TAB VIEWS */}
                    {activeTab === 'todo' && (
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Task ID</th>
                              <th>Title</th>
                              <th>Due Date</th>
                              <th>Priority</th>
                              <th>Assignee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {todoTasks.length === 0 ? (
                              <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No To-Do tasks in this project.</td>
                              </tr>
                            ) : (
                              todoTasks.map(t => (
                                <tr key={t.id}>
                                  <td className="mono-font" style={{ color: 'var(--text-muted)' }}>#{t.id}</td>
                                  <td style={{ fontWeight: '500' }}>{t.title}</td>
                                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} />{t.dueDate}</div></td>
                                  <td><Badge type={t.priority}>{t.priority}</Badge></td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Avatar name={t.assignee} size="sm" />
                                      <span>{t.assignee}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeTab === 'progress' && (
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Task ID</th>
                              <th>Title</th>
                              <th>Due Date</th>
                              <th>Priority</th>
                              <th>Assignee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inProgressTasks.length === 0 ? (
                              <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No tasks currently in progress.</td>
                              </tr>
                            ) : (
                              inProgressTasks.map(t => (
                                <tr key={t.id}>
                                  <td className="mono-font" style={{ color: 'var(--text-muted)' }}>#{t.id}</td>
                                  <td style={{ fontWeight: '500' }}>{t.title}</td>
                                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} />{t.dueDate}</div></td>
                                  <td><Badge type={t.priority}>{t.priority}</Badge></td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Avatar name={t.assignee} size="sm" />
                                      <span>{t.assignee}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeTab === 'completed' && (
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Task ID</th>
                              <th>Title</th>
                              <th>Completion Date</th>
                              <th>Priority</th>
                              <th>Assignee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {completedTasks.length === 0 ? (
                              <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No completed tasks.</td>
                              </tr>
                            ) : (
                              completedTasks.map(t => (
                                <tr key={t.id}>
                                  <td className="mono-font" style={{ color: 'var(--text-muted)' }}>#{t.id}</td>
                                  <td style={{ fontWeight: '500', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{t.title}</td>
                                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}><CheckCircle size={14} />{t.dueDate}</div></td>
                                  <td><Badge type={t.priority}>{t.priority}</Badge></td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Avatar name={t.assignee} size="sm" />
                                      <span>{t.assignee}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeTab === 'team' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {proj.team.map(m => (
                          <div key={m.id} style={{ 
                            padding: '12px 16px', 
                            borderRadius: '10px', 
                            background: 'rgba(74, 144, 226, 0.05)', 
                            border: '1px solid var(--card-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <Avatar name={m.name} size="sm" glow={m.status === 'Active'} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{m.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

    </div>
  );
}
