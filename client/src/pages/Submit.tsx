import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, type Feature, RV_TYPES, FLOORPLAN_TYPES } from '../lib/api'

export default function Submit() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    type: '',
    lengthFt: '',
    sleeps: '',
    slides: '',
    weightLbs: '',
    msrp: '',
    floorplanType: '',
    description: '',
    imageUrl: '',
    submittedBy: '',
  })

  useEffect(() => {
    api.getFeatures().then(setFeatures).catch(console.error)
  }, [])

  const setField = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const result = await api.submit({ ...form, featureKeys: selectedFeatures })
      setSuccess(result.message)
      setForm({
        brand: '', model: '', year: '', type: '', lengthFt: '', sleeps: '',
        slides: '', weightLbs: '', msrp: '', floorplanType: '', description: '', imageUrl: '', submittedBy: '',
      })
      setSelectedFeatures([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
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
        <span className="text-gray-600 text-sm">Submit an RV</span>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Submit an RV</h1>
        <p className="text-gray-500 mb-8">Help grow the database! Submissions are reviewed before going live.</p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 mb-6 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input
                required
                type="text"
                value={form.brand}
                onChange={(e) => setField('brand', e.target.value)}
                placeholder="e.g. Winnebago"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                required
                type="text"
                value={form.model}
                onChange={(e) => setField('model', e.target.value)}
                placeholder="e.g. Solis 59P"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                required
                type="number"
                min={1990}
                max={2030}
                value={form.year}
                onChange={(e) => setField('year', e.target.value)}
                placeholder="2024"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RV Type *</label>
              <select
                required
                value={form.type}
                onChange={(e) => setField('type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="">Select type...</option>
                {RV_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length (ft) *</label>
              <input
                required
                type="number"
                step="0.5"
                value={form.lengthFt}
                onChange={(e) => setField('lengthFt', e.target.value)}
                placeholder="25"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sleeps *</label>
              <input
                required
                type="number"
                min={1}
                value={form.sleeps}
                onChange={(e) => setField('sleeps', e.target.value)}
                placeholder="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slides</label>
              <input
                type="number"
                min={0}
                value={form.slides}
                onChange={(e) => setField('slides', e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
              <input
                type="number"
                value={form.weightLbs}
                onChange={(e) => setField('weightLbs', e.target.value)}
                placeholder="8500"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MSRP ($)</label>
              <input
                type="number"
                value={form.msrp}
                onChange={(e) => setField('msrp', e.target.value)}
                placeholder="55000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Floorplan Type *</label>
            <select
              required
              value={form.floorplanType}
              onChange={(e) => setField('floorplanType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Select floorplan...</option>
              {FLOORPLAN_TYPES.map((f) => (
                <option key={f.value} value={f.value}>{f.label} — {f.description}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={3}
              placeholder="Brief description of the RV..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setField('imageUrl', e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features (select all that apply)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {features.map((f) => (
                <label
                  key={f.key}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                    selectedFeatures.includes(f.key)
                      ? 'bg-blue-50 border-blue-400 text-blue-800'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(f.key)}
                    onChange={() => toggleFeature(f.key)}
                    className="accent-blue-500"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name / email (optional)</label>
            <input
              type="text"
              value={form.submittedBy}
              onChange={(e) => setField('submittedBy', e.target.value)}
              placeholder="Anonymous"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit RV for Review'}
          </button>
        </form>
      </div>
    </div>
  )
}
