export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <article className="stat-card">
      <span className="stat-icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {hint ? <p className="stat-hint">{hint}</p> : null}
    </article>
  )
}
