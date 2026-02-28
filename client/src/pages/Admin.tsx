import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, type RV, RV_TYPES, FLOORPLAN_TYPES } from '../lib/api'

export default function Admin() {
  const [submissions, setSubmissions] = useState<RV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    api.admin.getSubmissions()
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🚐</span>
          <span className="font-bold text-blue-800">RV Matchmaker</span>
        </Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-600 text-sm font-medium">Admin — Pending Submissions</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pending Submissions</h1>
            <p className="text-gray-500 mt-1">Review community RV submissions before they go live.</p>
          </div>
          <button
            type="button"
            onClick={load}
            className="text-sm text-blue-600 hover:underline"
          >
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
            <h2 className="text-xl font-semibold text-gray-700 mb-2">All caught up!</h2>
            <p className="text-gray-500">No pending submissions to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((rv) => {
              const typeName = RV_TYPES.find((t) => t.value === rv.type)?.label ?? rv.type
              const floorplanName = FLOORPLAN_TYPES.find((f) => f.value === rv.floorplanType)?.label ?? rv.floorplanType

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
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">${rv.msrp.toLocaleString()}</span>
                        )}
                      </div>

                      {rv.description && (
                        <p className="text-sm text-gray-600 mb-3">{rv.description}</p>
                      )}

                      {rv.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {rv.features.map((f) => (
                            <span key={f.feature.key} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                              {f.feature.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {rv.submittedBy && (
                        <p className="text-xs text-gray-400">Submitted by: {rv.submittedBy}</p>
                      )}
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
    </div>
  )
}
