import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchPersons, createPerson, updatePerson, deletePerson } from '../api/persons'
import { extractErrorMessage } from '../api/client'
import { PersonFormModal } from '../components/PersonFormModal'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function PersonsPage() {
  const { isAdmin } = useAuth()
  const [persons, setPersons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingPerson, setEditingPerson] = useState(null) // null | {} (new) | person (edit)
  const [showForm, setShowForm] = useState(false)
  const [deletingPerson, setDeletingPerson] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchPersons()
      setPersons(data)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openCreateForm() {
    setEditingPerson(null)
    setShowForm(true)
  }

  function openEditForm(person) {
    setEditingPerson(person)
    setShowForm(true)
  }

  async function handleFormSubmit(values) {
    if (editingPerson) {
      const updated = await updatePerson(editingPerson.id, values)
      setPersons((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    } else {
      const created = await createPerson(values)
      setPersons((prev) => [...prev, created])
    }
    setShowForm(false)
    setEditingPerson(null)
  }

  async function handleDeleteConfirm() {
    await deletePerson(deletingPerson.id)
    setPersons((prev) => prev.filter((p) => p.id !== deletingPerson.id))
    setDeletingPerson(null)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-header__eyebrow">
            {persons.length} {persons.length === 1 ? 'entry' : 'entries'}
          </p>
          <h1 className="page-header__title">Roster</h1>
        </div>
        {isAdmin && (
          <button className="btn btn--brass" onClick={openCreateForm}>
            + Add entry
          </button>
        )}
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading roster…</div>
      ) : persons.length === 0 ? (
        <div className="empty-state">No entries yet.</div>
      ) : (
        <table className="roster-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => (
              <tr key={person.id}>
                <td className="name-cell">
                  {person.firstName} {person.lastName}
                </td>
                <td className="email-cell">{person.email}</td>
                {isAdmin && (
                  <td className="actions">
                    <button className="btn btn--text" onClick={() => openEditForm(person)}>
                      Edit
                    </button>
                    <button
                      className="btn btn--danger-text"
                      onClick={() => setDeletingPerson(person)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <PersonFormModal
          person={editingPerson}
          onClose={() => {
            setShowForm(false)
            setEditingPerson(null)
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {deletingPerson && (
        <ConfirmDialog
          title="Remove entry"
          message={
            <>
              Remove <strong>{deletingPerson.firstName} {deletingPerson.lastName}</strong> from the
              roster? This cannot be undone.
            </>
          }
          confirmLabel="Remove"
          onCancel={() => setDeletingPerson(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}
