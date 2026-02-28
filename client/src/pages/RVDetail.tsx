import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { api, type RV, type ScoredRV, RV_TYPES, FLOORPLAN_TYPES } from '../lib/api'

export default function RVDetail() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const locationRv = (location.state as { rv?: ScoredRV } | null)?.rv

  const [rv, setRv] = useState<RV | ScoredRV | null>(locationRv ?? null)
  const [loading, setLoading] = useState(!locationRv)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!locationRv && id) {
      api.getRV(Number(id))
        .then(setRv)
        .catch(() => setError('RV not found'))
        .finally(() => setLoading(false))
    }
  }, [id, locationRv])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    )
  }

  if (error || !rv) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || 'RV not found'}</p>
        <Link to="/" className="text-blue-600 hover:underline">Go Home</Link>
      </div>
    )
  }

  const scored = rv as ScoredRV
  const typeName = RV_TYPES.find((t) => t.value === rv.type)?.label ?? rv.type
  const floorplanName = FLOORPLAN_TYPES.find((f) => f.value === rv.floorplanType)?.label ?? rv.floorplanType

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🚐</span>
          <span className="font-bold text-blue-800">RV Matchmaker</span>
        </Link>
        <span className="text-gray-300">›</span>
        <Link to="/results" className="text-blue-600 hover:underline text-sm">Results</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-600 text-sm">{rv.brand} {rv.model}</span>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="h-56 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            {rv.imageUrl ? (
              <img src={rv.imageUrl} alt={`${rv.brand} ${rv.model}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-7xl">🚐</span>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{rv.brand} {rv.model}</h1>
                <p className="text-gray-500 mt-1">{rv.year} • {typeName}</p>
              </div>
              <div className="text-right shrink-0">
                {scored.score !== undefined && (
                  <div className={`inline-block px-3 py-1 rounded-full text-white font-bold text-lg mb-1 ${
                    scored.score >= 75 ? 'bg-green-500' : scored.score >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                  }`}>
                    {scored.score}% Match
                  </div>
                )}
                {rv.msrp && (
                  <p className="text-xl font-bold text-gray-800">${rv.msrp.toLocaleString()}</p>
                )}
              </div>
            </div>

            {rv.description && (
              <p className="mt-4 text-gray-600 leading-relaxed">{rv.description}</p>
            )}
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Length', value: `${rv.lengthFt} ft` },
              { label: 'Sleeps', value: rv.sleeps },
              { label: 'Slides', value: rv.slides },
              { label: 'Floorplan', value: floorplanName },
              rv.weightLbs ? { label: 'Weight', value: `${rv.weightLbs.toLocaleString()} lbs` } : null,
              rv.msrp ? { label: 'MSRP', value: `$${rv.msrp.toLocaleString()}` } : null,
            ]
              .filter(Boolean)
              .map((spec) => (
                <div key={spec!.label} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">{spec!.label}</div>
                  <div className="font-semibold text-gray-900">{spec!.value}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Features */}
        {rv.features.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {rv.features.map((f) => {
                const isMatched = scored.matchDetails?.matchedFeatures?.includes(f.feature.key)
                return (
                  <span
                    key={f.feature.key}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isMatched
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {isMatched && '✓ '}{f.feature.label}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Match details (only if came from results) */}
        {scored.matchDetails && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h2 className="text-lg font-bold text-blue-900 mb-3">Match Breakdown</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Feature Score:</span>{' '}
                <span className="font-bold">{scored.matchDetails.featureScore} pts</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Floorplan Bonus:</span>{' '}
                <span className="font-bold">+{scored.matchDetails.floorplanBonus} pts</span>
              </div>
            </div>
            {scored.matchDetails.missingFeatures.length > 0 && (
              <div className="mt-3">
                <span className="text-sm text-gray-600">Missing from your ranking: </span>
                <span className="text-sm text-red-600">
                  {scored.matchDetails.missingFeatures.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
