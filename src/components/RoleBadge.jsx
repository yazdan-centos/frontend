export function RoleBadge({ role }) {
  const isAdmin = role === 'ADMIN'
  return <span className={`stamp ${isAdmin ? 'stamp--admin' : 'stamp--user'}`}>{role}</span>
}
