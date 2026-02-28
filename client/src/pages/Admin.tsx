import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { api, type RV, type Feature, RV_TYPES, FLOORPLAN_TYPES } from '../lib/api'

type Tab = 'submissions' | 'features'

// ── Submissions tab ──────────────────────────────────────────────────────────

function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<RV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    api.admin
      .getSubmissions()
      .then(setSubmissions)
      .catch(() => setError('Failed to load submissions'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleReview = async (id: number, action: 'approve' | 'reject') => {
    setProcessing(id)
    try {
      await api.admin.review(id, action)
      setSubmissions((prev) => prev.filter((rv) => rv.id !== id))
    } catch {
      setError('Action failed')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Pending Submissions</h2>
          <p className="text-gray-500 mt-1 text-sm">Review community RV submissions before they go live.</p>
        </div>
        <button type="button" onClick={load} className="text-sm text-blue-600 hover:underline">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">All caught up!</h3>
          <p className="text-gray-500">No pending submissions to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((rv) => {
            const typeName = RV_TYPES.find((t) => t.value === rv.type)?.label ?? rv.type
            const floorplanName =
              FLOORPLAN_TYPES.find((f) => f.value === rv.floorplanType)?.label ?? rv.floorplanType
            return (
              <div key={rv.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {rv.brand} {rv.model} ({rv.year})
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1 mb-3">
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">{typeName}</span>
                      <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">{floorplanName}</span>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{rv.lengthFt} ft</span>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">Sleeps {rv.sleeps}</span>
                      {rv.slides > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{rv.slides} slides</span>
                      )}
                      {rv.msrp && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                          ${rv.msrp.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {rv.description && <p className="text-sm text-gray-600 mb-3">{rv.description}</p>}
                    {rv.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {rv.features.map((f) => (
                          <span key={f.feature.key} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {f.feature.label}
                          </span>
                        ))}
                      </div>
                    )}
                    {rv.submittedBy && <p className="text-xs text-gray-400">Submitted by: {rv.submittedBy}</p>}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleReview(rv.id, 'approve')}
                      disabled={processing === rv.id}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
                    >
                      {processing === rv.id ? '...' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReview(rv.id, 'reject')}
                      disabled={processing === rv.id}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
                    >
                      {processing === rv.id ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Features tab ─────────────────────────────────────────────────────────────

function FeaturesTab() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<{ label: string; key: string; category: string }>({ label: '', key: '', category: '' })
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  // Form state
  const [label, setLabel] = useState('')
  const [key, setKey] = useState('')
  const [keyEdited, setKeyEdited] = useState(false)
  const [category, setCategory] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    api.getFeatures()
      .then(setFeatures)
      .catch(() => setError('Failed to load features'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Auto-generate key from label unless user has manually edited it
  const handleLabelChange = (val: string) => {
    setLabel(val)
    if (!keyEdited) {
      setKey(val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''))
    }
  }

  const existingCategories = useMemo(
    () => [...new Set(features.map((f) => f.category))].sort(),
    [features],
  )

  const grouped = useMemo(() => {
    const g: Record<string, Feature[]> = {}
    for (const f of features) {
      ;(g[f.category] ??= []).push(f)
    }
    return g
  }, [features])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!label.trim() || !key.trim() || !category.trim()) {
      setFormError('All fields are required.')
      return
    }
    setSaving(true)
    try {
      const created = await api.admin.createFeature({ key: key.trim(), label: label.trim(), category: category.trim() })
      setFeatures((prev) => [...prev, created].sort((a, b) => a.label.localeCompare(b.label)))
      setLabel('')
      setKey('')
      setKeyEdited(false)
      setCategory('')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create feature')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (f: Feature) => {
    setEditingId(f.id)
    setEditDraft({ label: f.label, key: f.key, category: f.category })
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditError('')
  }

  const handleSaveEdit = async () => {
    if (!editDraft.label.trim() || !editDraft.key.trim() || !editDraft.category.trim()) {
      setEditError('All fields are required.')
      return
    }
    setEditSaving(true)
    setEditError('')
    try {
      const updated = await api.admin.updateFeature(editingId!, editDraft)
      setFeatures((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
      setEditingId(null)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setEditSaving(false)
    }
  }

  const handleDelete = async (f: Feature) => {
    if (!confirm(`Delete "${f.label}"? This also removes it from any RVs that have it.`)) return
    setDeleting(f.id)
    try {
      await api.admin.deleteFeature(f.id)
      setFeatures((prev) => prev.filter((x) => x.id !== f.id))
    } catch {
      setError('Failed to delete feature')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">
      {/* Add form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24">
        <h2 className="text-lg font-bold mb-4">Add New Feature</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="e.g. Heated Floors"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Key <span className="text-gray-400 font-normal">(auto-generated, must be unique)</span>
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => { setKey(e.target.value); setKeyEdited(true) }}
              placeholder="e.g. heated_floors"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <input
              type="text"
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Climate"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <datalist id="category-suggestions">
              {existingCategories.map((c) => <option key={c} value={c} />)}
            </datalist>
            {existingCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {existingCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                      category === c
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {formError && <p className="text-red-600 text-xs">{formError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            {saving ? 'Adding...' : 'Add Feature'}
          </button>
        </form>
      </div>

      {/* Feature list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{features.length} Features</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {loading ? (
          <div className="text-gray-400 py-10 text-center">Loading...</div>
        ) : (
          <div className="space-y-4">
            {Object.keys(grouped).sort().map((cat) => (
              <div key={cat} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{cat}</h3>
                <div className="space-y-1">
                  {grouped[cat].map((f) => (
                    <div key={f.id}>
                      {editingId === f.id ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-0.5">Label</label>
                              <input
                                type="text"
                                value={editDraft.label}
                                onChange={(e) => setEditDraft((d) => ({ ...d, label: e.target.value }))}
                                className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-0.5">Key</label>
                              <input
                                type="text"
                                value={editDraft.key}
                                onChange={(e) => setEditDraft((d) => ({ ...d, key: e.target.value }))}
                                className="w-full border border-gray-200 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-0.5">Category</label>
                              <input
                                type="text"
                                list="category-suggestions"
                                value={editDraft.category}
                                onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))}
                                className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                          </div>
                          {editError && <p className="text-red-600 text-xs">{editError}</p>}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              disabled={editSaving}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-60"
                            >
                              {editSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 text-xs rounded border border-gray-200 hover:border-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3 py-1.5">
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-gray-800">{f.label}</span>
                            <span className="ml-2 text-xs text-gray-400 font-mono">{f.key}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEdit(f)}
                              className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(f)}
                              disabled={deleting === f.id}
                              className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                            >
                              {deleting === f.id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Admin page ───────────────────────────────────────────────────────────

export default function Admin() {
  const [tab, setTab] = useState<Tab>('submissions')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🚐</span>
          <span className="font-bold text-blue-800">RV Matchmaker</span>
        </Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-600 text-sm font-medium">Admin</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          {([['submissions', 'Submissions'], ['features', 'Manage Features']] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'submissions' ? <SubmissionsTab /> : <FeaturesTab />}
      </div>
    </div>
  )
}
