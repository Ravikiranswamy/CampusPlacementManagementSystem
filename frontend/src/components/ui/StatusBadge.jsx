export default function StatusBadge({ value, status }) {
  const text = value ?? status ?? 'N/A'
  const tone = String(text).toLowerCase().replace(/\s+/g, '-')
  return <span className={`status status-${tone}`}>{text}</span>
}
