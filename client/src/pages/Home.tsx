import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚐</span>
          <span className="font-bold text-xl text-blue-800">RV Matchmaker</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/submit" className="text-gray-600 hover:text-blue-700">Submit an RV</Link>
          <Link to="/admin" className="text-gray-600 hover:text-blue-700">Admin</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🚐</div>
          <h1 className="text-5xl font-extrabold text-blue-900 mb-4 leading-tight">
            Find Your Perfect RV
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Answer a few questions about what matters most to you — we'll match you with the RVs that fit your lifestyle, budget, and must-haves.
          </p>
          <Link
            to="/match"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-colors"
          >
            Start Matching
          </Link>
          <p className="mt-4 text-sm text-gray-400">Takes about 2 minutes</p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl w-full px-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Smart Matching</h3>
            <p className="text-gray-500 text-sm">Filter by hard requirements, then rank features by importance for personalized scores.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left">
            <div className="text-3xl mb-3">📐</div>
            <h3 className="font-bold text-lg mb-2">Floorplan Fit</h3>
            <p className="text-gray-500 text-sm">Pick your preferred layouts — bunkhouse, rear living, split bath, and more.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-lg mb-2">Community Database</h3>
            <p className="text-gray-500 text-sm">Curated RVs plus community submissions reviewed before going live.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
