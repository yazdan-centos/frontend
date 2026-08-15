import { client } from './client'

// GET /api/persons — USER or ADMIN
// Response: [{ id, firstName, lastName, email }]
export async function fetchPersons() {
  const { data } = await client.get('/api/persons')
  return data
}

// POST /api/persons — ADMIN only
// Request:  { firstName, lastName, email }
// Response: { id, firstName, lastName, email }
export async function createPerson(person) {
  const { data } = await client.post('/api/persons', person)
  return data
}

// PUT /api/persons/{id} — ADMIN only
export async function updatePerson(id, person) {
  const { data } = await client.put(`/api/persons/${id}`, person)
  return data
}

// DELETE /api/persons/{id} — ADMIN only
export async function deletePerson(id) {
  await client.delete(`/api/persons/${id}`)
}
