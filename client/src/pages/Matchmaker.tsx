import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, type Feature } from '../lib/api'
import StepNonNegotiables from '../components/StepNonNegotiables'
import StepFeatureRanking from '../components/StepFeatureRanking'
import StepFloorplan from '../components/StepFloorplan'

const STEPS = [
  { id: 1, title: 'Non-Negotiables', subtitle: 'Hard filters that eliminate non-matches' },
  { id: 2, title: 'Feature Ranking', subtitle: 'What features matter most to you?' },
  { id: 3, title: 'Floorplan', subtitle: 'Which layouts do you prefer?' },
]

export default function Matchmaker() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 state
  const [rvTypes, setRvTypes] = useState<string[]>([])
  const [maxLengthFt, setMaxLengthFt] = useState('')
  const [minSleeps, setMinSleeps] = useState('')
  const [mustHaveFeatures, setMustHaveFeatures] = useState<string[]>([])

  // Step 2 state
  const [rankedFeatures, setRankedFeatures] = useState<string[]>([])

  // Step 3 state
  const [preferredFloorplans, setPreferredFloorplans] = useState<string[]>([])

  useEffect(() => {
    api.getFeatures().then(setFeatures).catch(console.error)
  }, [])

  const handleStep1Change = (field: string, value: unknown) => {
    if (field === 'rvTypes') setRvTypes(value as string[])
    if (field === 'maxLengthFt') setMaxLengthFt(value as string)
    if (field === 'minSleeps') setMinSleeps(value as string)
    if (field === 'mustHaveFeatures') setMustHaveFeatures(value as string[])
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const prefs = {
        rvTypes,
        maxLengthFt: maxLengthFt ? Number(maxLengthFt) : null,
        minSleeps: minSleeps ? Number(minSleeps) : null,
        mustHaveFeatures,
        rankedFeatures,
        preferredFloorplans,
      }
      const results = await api.match(prefs)
      navigate('/results', { state: { results, prefs } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <span className="text-xl">🚐</span>
          <span className="font-bold text-blue-800">RV Matchmaker</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  s.id < step
                    ? 'bg-green-500 text-white'
                    : s.id === step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s.id < step ? '✓' : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 rounded-full ${s.id < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{STEPS[step - 1].title}</h2>
          <p className="text-gray-500 mt-1">{STEPS[step - 1].subtitle}</p>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {step === 1 && (
            <StepNonNegotiables
              rvTypes={rvTypes}
              maxLengthFt={maxLengthFt}
              minSleeps={minSleeps}
              mustHaveFeatures={mustHaveFeatures}
              features={features}
              onChange={handleStep1Change}
            />
          )}
          {step === 2 && (
            <StepFeatureRanking
              rankedFeatures={rankedFeatures}
              features={features}
              onChange={setRankedFeatures}
            />
          )}
          {step === 3 && (
            <StepFloorplan
              preferredFloorplans={preferredFloorplans}
              onChange={setPreferredFloorplans}
            />
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Finding matches...' : 'Find My RV'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
