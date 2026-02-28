import { useLocation, Link, useNavigate } from 'react-router-dom'
import { type ScoredRV, type MatchPreferences, RV_TYPES } from '../lib/api'
import RVCard from '../components/RVCard'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { results: ScoredRV[]; prefs: MatchPreferences } | null

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No results yet.</p>
        <Link to="/match" className="text-blue-600 hover:underline">Start the matchmaker</Link>
      </div>
    )
  }

  const { results, prefs } = state

  const activeTypes = prefs.rvTypes.length > 0
    ? prefs.rvTypes.map((t) => RV_TYPES.find((rt) => rt.value === t)?.label ?? t).join(', ')
    : 'All types'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🚐</span>
          <span className="font-bold text-blue-800">RV Matchmaker</span>
        </Link>
        <button
          type="button"
          onClick={() => navigate('/match')}
          className="text-sm text-blue-600 hover:underline"
        >
          Refine Search
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {results.length} Match{results.length !== 1 ? 'es' : ''} Found
          </h1>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="bg-gray-100 px-3 py-1 rounded-full">{activeTypes}</span>
            {prefs.maxLengthFt && (
              <span className="bg-gray-100 px-3 py-1 rounded-full">Max {prefs.maxLengthFt} ft</span>
            )}
            {prefs.minSleeps && (
              <span className="bg-gray-100 px-3 py-1 rounded-full">Sleeps {prefs.minSleeps}+</span>
            )}
            {prefs.mustHaveFeatures.length > 0 && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                {prefs.mustHaveFeatures.length} required feature{prefs.mustHaveFeatures.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No RVs matched your filters</h2>
            <p className="text-gray-500 mb-6">Try relaxing your non-negotiables or must-have features.</p>
            <button
              type="button"
              onClick={() => navigate('/match')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Adjust Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((rv) => (
              <RVCard key={rv.id} rv={rv} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
