import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, RV_TYPES, FLOORPLAN_TYPES } from '../lib/api'
import type { Feature, RV } from '../lib/api'

// Controls display order of categories. Any category not listed here appears at the end.
const CATEGORY_ORDER = [
  'Sleeping',
  'Bathroom',
  'Kitchen',
  'Climate',
  'Power & Energy',
  'Entertainment',
  'Tech & Convenience',
  'Storage',
  'Comfort & Other',
]

const FLOORPLAN_ICONS: Record<string, string> = {
  BUNKHOUSE: '🛏️',
  REAR_LIVING: '🛋️',
  FRONT_LIVING: '🪑',
  REAR_BEDROOM: '🚪',
  SPLIT_BATH: '🚿',
  SINGLE_SLIDE: '↔️',
  NO_SLIDE: '📦',
}

type FeatureMode = 'preferred' | 'must'

export default function Matchmaker() {
  const navigate = useNavigate()
  const [rvs, setRvs] = useState<RV[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [rvTypes, setRvTypes] = useState<string[]>([])
  const [maxLengthFt, setMaxLengthFt] = useState('')
  const [minSleeps, setMinSleeps] = useState('')
  const [floorplanState, setFloorplanState] = useState<Record<string, FeatureMode>>({})
  const [featureState, setFeatureState] = useState<Record<string, FeatureMode>>({})
  const [selectionOrder, setSelectionOrder] = useState<string[]>([])

  useEffect(() => {
    Promise.all([api.getRVs(), api.getFeatures()])
      .then(([rvData, featureData]) => {
        setRvs(rvData)
        setFeatures(featureData)
      })
      .catch(console.error)
  }, [])

  const matchCount = useMemo(() => {
    const mustHaveFeats = Object.entries(featureState).filter(([, v]) => v === 'must').map(([k]) => k)
    const mustHaveFps = Object.entries(floorplanState).filter(([, v]) => v === 'must').map(([k]) => k)
    return rvs.filter((rv) => {
      const rvFeatureKeys = rv.features.map((f) => f.feature.key)
      if (rvTypes.length && !rvTypes.includes(rv.type)) return false
      if (maxLengthFt && rv.lengthFt > Number(maxLengthFt)) return false
      if (minSleeps && rv.sleeps < Number(minSleeps)) return false
      if (mustHaveFeats.some((k) => !rvFeatureKeys.includes(k))) return false
      if (mustHaveFps.length && !mustHaveFps.includes(rv.floorplanType)) return false
      return true
    }).length
  }, [rvs, rvTypes, maxLengthFt, minSleeps, featureState, floorplanState])

  function cycleFeature(key: string) {
    const current = featureState[key]
    if (!current) {
      setFeatureState((s) => ({ ...s, [key]: 'preferred' }))
      setSelectionOrder((o) => [...o, key])
    } else if (current === 'preferred') {
      setFeatureState((s) => ({ ...s, [key]: 'must' }))
    } else {
      setFeatureState((s) => {
        const next = { ...s }
        delete next[key]
        return next
      })
      setSelectionOrder((o) => o.filter((k) => k !== key))
    }
  }

  function toggleType(type: string) {
    setRvTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  function cycleFloorplan(fp: string) {
    const current = floorplanState[fp]
    if (!current) {
      setFloorplanState((s) => ({ ...s, [fp]: 'preferred' }))
    } else if (current === 'preferred') {
      setFloorplanState((s) => ({ ...s, [fp]: 'must' }))
    } else {
      setFloorplanState((s) => {
        const next = { ...s }
        delete next[fp]
        return next
      })
    }
  }

  async function handleViewResults() {
    setLoading(true)
    setError('')
    try {
      const mustHaveFeatures = Object.entries(featureState).filter(([, v]) => v === 'must').map(([k]) => k)
      const rankedFeatures = selectionOrder.filter((k) => featureState[k] === 'preferred')
      const preferredFloorplans = Object.entries(floorplanState).filter(([, v]) => v === 'preferred').map(([k]) => k)
      const mustHaveFloorplans = Object.entries(floorplanState).filter(([, v]) => v === 'must').map(([k]) => k)
      const prefs = {
        rvTypes,
        maxLengthFt: maxLengthFt ? Number(maxLengthFt) : null,
        minSleeps: minSleeps ? Number(minSleeps) : null,
        mustHaveFeatures,
        rankedFeatures,
        preferredFloorplans,
        mustHaveFloorplans,
      }
      const results = await api.match(prefs)
      navigate('/results', { state: { results, prefs } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const featureCategories = useMemo(() => {
    const grouped: Record<string, Feature[]> = {}
    for (const f of features) {
      ;(grouped[f.category] ??= []).push(f)
    }
    const ordered = CATEGORY_ORDER.filter((c) => grouped[c]).map((c) => ({ label: c, features: grouped[c] }))
    const rest = Object.keys(grouped)
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .map((c) => ({ label: c, features: grouped[c] }))
    return [...ordered, ...rest]
  }, [features])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🚐</span>
            <span className="font-bold text-blue-800 hidden sm:inline">RV Matchmaker</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-xl px-5 py-2 text-center min-w-[72px]">
              <div className="text-3xl font-bold leading-none">{matchCount}</div>
              <div className="text-xs opacity-80 mt-0.5">matches</div>
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <button
                type="button"
                onClick={handleViewResults}
                disabled={loading || matchCount === 0}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
              >
                {loading ? 'Loading...' : 'View Results →'}
              </button>
              {matchCount === 0 && (
                <span className="text-xs text-gray-400 pl-1">Relax a filter to see matches</span>
              )}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-xs text-center pb-2">{error}</p>}
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Legend */}
        <p className="text-xs text-gray-500 mb-5">
          Click a feature once to mark it as{' '}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 border border-blue-400 text-blue-800 rounded-full font-medium">
            ★ preferred
          </span>
          {' '}· click again to require it as{' '}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 border border-red-400 text-red-800 rounded-full font-medium">
            ! must have
          </span>
          {' '}(reduces match count) · click once more to remove.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left: filters */}
          <div className="space-y-5">
            {/* RV Type */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">RV Type</h3>
                {rvTypes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRvTypes([])}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {RV_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => toggleType(t.value)}
                    className={`px-2 py-2 text-xs font-medium rounded-lg border text-left transition-colors leading-tight ${
                      rvTypes.includes(t.value)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-800 text-sm">Size</h3>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max length (ft)</label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={maxLengthFt}
                  onChange={(e) => setMaxLengthFt(e.target.value)}
                  placeholder="Any"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sleeps at least</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={minSleeps}
                  onChange={(e) => setMinSleeps(e.target.value)}
                  placeholder="Any"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Floorplan */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">Floorplan</h3>
                {Object.keys(floorplanState).length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFloorplanState({})}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {FLOORPLAN_TYPES.map((fp) => {
                  const mode = floorplanState[fp.value]
                  return (
                    <button
                      key={fp.value}
                      type="button"
                      onClick={() => cycleFloorplan(fp.value)}
                      title={
                        !mode
                          ? 'Click to mark as preferred'
                          : mode === 'preferred'
                            ? 'Click to require (must have)'
                            : 'Click to remove'
                      }
                      className={`px-3 py-1.5 text-sm rounded-full border font-medium transition-colors select-none ${
                        mode === 'must'
                          ? 'bg-red-100 border-red-400 text-red-800'
                          : mode === 'preferred'
                            ? 'bg-blue-100 border-blue-400 text-blue-800'
                            : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {FLOORPLAN_ICONS[fp.value] ?? '🏠'}{' '}
                      {mode === 'must' ? '! ' : mode === 'preferred' ? '★ ' : ''}
                      {fp.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: feature categories */}
          <div className="space-y-4">
            {featureCategories.map((cat) => (
              <div key={cat.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 text-sm mb-3">{cat.label}</h3>
                <div className="flex flex-wrap gap-2">
                    {cat.features.map((f) => {
                      const mode = featureState[f.key]
                      return (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => cycleFeature(f.key)}
                          title={
                            !mode
                              ? 'Click to mark as preferred'
                              : mode === 'preferred'
                                ? 'Click to require (must have)'
                                : 'Click to remove'
                          }
                          className={`px-3 py-1.5 text-sm rounded-full border font-medium transition-colors select-none ${
                            mode === 'must'
                              ? 'bg-red-100 border-red-400 text-red-800'
                              : mode === 'preferred'
                                ? 'bg-blue-100 border-blue-400 text-blue-800'
                                : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {mode === 'must' ? '! ' : mode === 'preferred' ? '★ ' : ''}
                          {f.label}
                        </button>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
