export default function EmptyState({ icon = '📋', title, hint }) {
  return (
    <div className="empty-state card card-muted" style={{ boxShadow: 'none', textAlign: 'center', padding: '28px 20px' }}>
      <div className="empty-icon" aria-hidden>{icon}</div>
      <div className="empty-title">{title}</div>
      {hint && <div className="empty-hint">{hint}</div>}
    </div>
  );
}
