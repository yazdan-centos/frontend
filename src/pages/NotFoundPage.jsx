import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="empty-state">
      <p>This page doesn't exist.</p>
      <Link to="/persons" className="btn btn--text">
        Back to roster
      </Link>
    </div>
  )
}
