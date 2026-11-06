export default function StatusBadge({ value }) {
  const tone = value.toLowerCase().replace(/\s+/g, '-')
  return <span className={`status status-${tone}`}>{value}</span>
}
