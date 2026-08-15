import { useState } from 'react'
import { extractErrorMessage } from '../api/client'

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onCancel, onConfirm }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleConfirm() {
    setError('')
    setBusy(true)
    try {
      await onConfirm()
    } catch (err) {
      setError(extractErrorMessage(err))
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">{title}</h2>
        {error && <div className="alert alert--error">{error}</div>}
        <p className="confirm-text">{message}</p>
        <div className="modal-card__actions">
          <button className="btn btn--ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn" style={{ background: '#a33c3c', color: '#fff' }} onClick={handleConfirm} disabled={busy}>
            {busy ? 'Removing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
