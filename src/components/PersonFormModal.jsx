import { useState } from 'react'
import { extractErrorMessage } from '../api/client'

const emptyForm = { firstName: '', lastName: '', email: '' }

export function PersonFormModal({ person, onClose, onSubmit }) {
  const isEdit = Boolean(person)
  const [form, setForm] = useState(
    person
      ? { firstName: person.firstName, lastName: person.lastName, email: person.email }
      : emptyForm
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">{isEdit ? 'Edit entry' : 'New entry'}</h2>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              value={form.firstName}
              maxLength={100}
              required
              onChange={(e) => updateField('firstName', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              value={form.lastName}
              maxLength={100}
              required
              onChange={(e) => updateField('lastName', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              maxLength={254}
              required
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>

          <div className="modal-card__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn--brass" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
