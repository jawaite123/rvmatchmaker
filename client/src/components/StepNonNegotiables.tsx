import { RV_TYPES } from '../lib/api'

interface Props {
  rvTypes: string[]
  maxLengthFt: string
  minSleeps: string
  mustHaveFeatures: string[]
  features: { id: number; key: string; label: string }[]
  onChange: (field: string, value: unknown) => void
}

export default function StepNonNegotiables({ rvTypes, maxLengthFt, minSleeps, mustHaveFeatures, features, onChange }: Props) {
  const toggleType = (val: string) => {
    onChange('rvTypes', rvTypes.includes(val) ? rvTypes.filter((t) => t !== val) : [...rvTypes, val])
  }

  const toggleFeature = (key: string) => {
    onChange(
      'mustHaveFeatures',
      mustHaveFeatures.includes(key) ? mustHaveFeatures.filter((f) => f !== key) : [...mustHaveFeatures, key],
    )
  }

  return (
    <div className="space-y-8">
      {/* RV Types */}
      <div>
        <h3 className="text-lg font-semibold mb-1">What types of RV are you open to?</h3>
        <p className="text-sm text-gray-500 mb-3">Select all that apply. Leave empty to consider all types.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RV_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => toggleType(t.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-left ${
                rvTypes.includes(t.value)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-blue-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Length */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Maximum length (feet)</h3>
        <p className="text-sm text-gray-500 mb-3">Important if you have site restrictions or storage limits.</p>
        <input
          type="number"
          min={10}
          max={60}
          placeholder="e.g. 35 (leave blank for no limit)"
          value={maxLengthFt}
          onChange={(e) => onChange('maxLengthFt', e.target.value)}
          className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Min Sleeps */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Minimum sleeping capacity</h3>
        <p className="text-sm text-gray-500 mb-3">How many people need beds?</p>
        <input
          type="number"
          min={1}
          max={15}
          placeholder="e.g. 4 (leave blank for no minimum)"
          value={minSleeps}
          onChange={(e) => onChange('minSleeps', e.target.value)}
          className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Must-have features */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Must-have features</h3>
        <p className="text-sm text-gray-500 mb-3">RVs missing these will be excluded entirely.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {features.map((f) => (
            <label
              key={f.key}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                mustHaveFeatures.includes(f.key)
                  ? 'bg-red-50 border-red-400 text-red-800'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={mustHaveFeatures.includes(f.key)}
                onChange={() => toggleFeature(f.key)}
                className="accent-red-500"
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
