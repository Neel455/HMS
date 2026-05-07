import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import Icon from '../components/Icon';
import Spinner from '../components/Spinner';

// ─── Constants ────────────────────────────────────────────────────────────────

const TASK_TYPES = [
  'departure_clean', 'arrival_prep', 'linen_refresh', 'turn_down',
  'deep_clean', 'maintenance_followup', 'inspection', 'other',
];

const TASK_TYPE_LABELS = {
  departure_clean:     'Departure clean',
  arrival_prep:        'Arrival prep',
  linen_refresh:       'Linen refresh',
  turn_down:           'Turn-down',
  deep_clean:          'Deep clean',
  maintenance_followup:'Maintenance follow-up',
  inspection:          'Inspection',
  other:               'Other',
};

const PRIORITY_CONFIG = {
  low:    { color: 'var(--mute)',       label: 'Low' },
  medium: { color: 'var(--brass)',      label: 'Medium' },
  high:   { color: 'var(--terracotta)', label: 'High' },
  urgent: { color: 'var(--plum)',       label: 'Urgent' },
};

const COLS = [
  { id: 'queued',      label: 'Queued' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed',   label: 'Completed today' },
];

const ADMIN_MGR = ['admin', 'manager'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long' });
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

function fmtTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, canManage, canComplete, onUpdate }) {
  const toast    = useToast();
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isDone   = task.status === 'completed';
  const assigneeName = task.assignedTo
    ? [task.assignedTo.name].filter(Boolean).join(' ')
    : task.assignedToName || '—';

  async function handleComplete() {
    try {
      await api.patch(`/api/housekeeping/${task._id}/complete`, { completionNote: '' });
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not mark complete.');
    }
  }

  async function handleProgress() {
    try {
      await api.patch(`/api/housekeeping/${task._id}`, { status: 'in-progress' });
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status.');
    }
  }

  return (
    <div className="card" style={{
      padding: 18, opacity: isDone ? 0.55 : 1,
      position: 'relative',
      borderLeft: `3px solid ${priority.color}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="display numeral" style={{ fontSize: 28, lineHeight: 1 }}>
          {task.room?.roomNumber || '—'}
        </div>
        <span style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: priority.color, fontWeight: 600 }}>
          {priority.label}
        </span>
      </div>

      <div style={{ fontSize: 13, marginTop: 8, fontWeight: 500, textDecoration: isDone ? 'line-through' : 'none' }}>
        {task.displayTitle || TASK_TYPE_LABELS[task.taskType] || task.taskType}
      </div>

      {task.notes && (
        <div style={{ fontSize: 11, color: 'var(--mute)', marginTop: 4, lineHeight: 1.4 }}>{task.notes}</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>
            {getInitials(assigneeName)}
          </div>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{assigneeName}</span>
        </div>
        <span className="mono" style={{ color: 'var(--mute)', fontSize: 11 }}>
          {task.scheduledFor ? fmtTime(task.scheduledFor) : '—'}
        </span>
      </div>

      {/* Actions */}
      {!isDone && canComplete && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {task.status === 'queued' && (
            <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={handleProgress}>
              Start
            </button>
          )}
          {task.status === 'in-progress' && (
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={handleComplete}>
              <Icon name="check" size={10} />Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Assign Task Modal ────────────────────────────────────────────────────────

function AssignTaskModal({ onClose, onSaved, rooms, staff }) {
  const toast = useToast();
  const [form, setForm] = useState({
    room:        '',
    taskType:    'departure_clean',
    priority:    'medium',
    assignedTo:  '',
    scheduledFor:'',
    notes:       '',
  });
  const [saving, setSaving] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleCreate() {
    if (!form.room) { toast.error('Please select a room.'); return; }
    setSaving(true);
    try {
      const payload = {
        room:     form.room,
        taskType: form.taskType,
        priority: form.priority,
        notes:    form.notes,
        ...(form.assignedTo   && { assignedTo:   form.assignedTo }),
        ...(form.scheduledFor && { scheduledFor: form.scheduledFor }),
      };
      await api.post('/api/housekeeping', payload);
      toast.success('Task assigned.');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Housekeeping</div>
            <h2 className="display" style={{ fontSize: 28, margin: 0 }}>Assign task</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="close" size={14} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="field">
            <label>Room *</label>
            <select value={form.room} onChange={e => set('room', e.target.value)}>
              <option value="">— Select room —</option>
              {rooms.map(r => (
                <option key={r._id} value={r._id}>
                  {r.roomNumber} · {r.type?.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Task type</label>
            <select value={form.taskType} onChange={e => set('taskType', e.target.value)}>
              {TASK_TYPES.map(t => <option key={t} value={t}>{TASK_TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}>
              {['low','medium','high','urgent'].map(p => (
                <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Assign to</label>
            <select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
              <option value="">— Unassigned —</option>
              {staff.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Scheduled for</label>
            <input type="datetime-local" value={form.scheduledFor} onChange={e => set('scheduledFor', e.target.value)} />
          </div>
        </div>

        <div className="field" style={{ marginBottom: 24 }}>
          <label>Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
            style={{ minHeight: 72, resize: 'vertical' }}
            placeholder="Special instructions…" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={saving}
            style={{ opacity: saving ? 0.7 : 1 }}>
            {saving
              ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderTopColor: 'var(--ivory)' }} />Assigning…</>
              : <><Icon name="plus" size={12} />Assign task</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HousekeepingPage() {
  const { user }  = useAuth();
  const role      = user?.role;
  const canManage  = ADMIN_MGR.includes(role);
  const canComplete = ['admin', 'manager', 'housekeeping'].includes(role);

  const [showAssign, setShowAssign] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: taskData,  loading: taskLoading  } = useApi('/api/housekeeping?limit=200', { deps: [refreshKey] });
  const { data: roomsData, loading: roomsLoading } = useApi('/api/rooms?limit=200');
  const { data: staffData                        } = useApi('/api/users?role=housekeeping&limit=50');

  const tasks = taskData?.tasks || [];
  const rooms = roomsData?.rooms || [];
  const staff = staffData?.users || [];

  function onUpdate() { setRefreshKey(k => k + 1); }
  function onSaved()  { setShowAssign(false); setRefreshKey(k => k + 1); }

  const counts = COLS.reduce((acc, c) => {
    acc[c.id] = tasks.filter(t => t.status === c.id).length;
    return acc;
  }, {});

  const loading = taskLoading || roomsLoading;

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Housekeeping · {todayLabel()}</div>
          <h1 className="display">The <em>pristine</em> board.</h1>
          <p className="sub">
            {counts['queued'] || 0} tasks queued · {counts['in-progress'] || 0} in progress · {counts['completed'] || 0} completed today.
          </p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setShowAssign(true)}>
            <Icon name="plus" size={12} />Assign task
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: 80 }}><Spinner page /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {COLS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
                  <h3 className="display" style={{ fontSize: 22, margin: 0 }}>{col.label}</h3>
                  <span className="eyebrow">{colTasks.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {colTasks.length === 0 && (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--mute)', fontSize: 12, fontStyle: 'italic', border: '1px dashed var(--hairline)', borderRadius: 2 }}>
                      No tasks
                    </div>
                  )}
                  {colTasks.map(t => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      canManage={canManage}
                      canComplete={canComplete}
                      onUpdate={onUpdate}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAssign && (
        <AssignTaskModal
          onClose={() => setShowAssign(false)}
          onSaved={onSaved}
          rooms={rooms}
          staff={staff}
        />
      )}
    </div>
  );
}
