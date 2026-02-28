import { Link } from 'react-router-dom'
import { type ScoredRV, RV_TYPES, FLOORPLAN_TYPES } from '../lib/api'

function scoreColor(score: number) {
  if (score >= 75) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-400'
}

interface Props {
  rv: ScoredRV
}

export default function RVCard({ rv }: Props) {
  const typeName = RV_TYPES.find((t) => t.value === rv.type)?.label ?? rv.type
  const floorplanName = FLOORPLAN_TYPES.find((f) => f.value === rv.floorplanType)?.label ?? rv.floorplanType

  return (
    <Link to={`/rv/${rv.id}`} state={{ rv }} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Image or placeholder */}
        <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
          {rv.imageUrl ? (
            <img src={rv.imageUrl} alt={`${rv.brand} ${rv.model}`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">🚐</span>
          )}
          {/* Score badge */}
          <div
            className={`absolute top-3 right-3 ${scoreColor(rv.score)} text-white font-bold text-sm px-2.5 py-1 rounded-full shadow`}
          >
            {rv.score}% Match
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-700 transition-colors">
                {rv.brand} {rv.model}
              </h3>
              <p className="text-xs text-gray-500">{rv.year}</p>
            </div>
            {rv.msrp && (
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                ${rv.msrp.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">{typeName}</span>
            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">{floorplanName}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 border-t border-gray-100 pt-3">
            <div>
              <div className="font-semibold text-gray-800">{rv.lengthFt} ft</div>
              <div>Length</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">{rv.sleeps}</div>
              <div>Sleeps</div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">{rv.slides}</div>
              <div>Slides</div>
            </div>
          </div>

          {rv.matchDetails?.matchedFeatures?.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="text-xs text-gray-500 mb-1">Matching features:</div>
              <div className="flex flex-wrap gap-1">
                {rv.matchDetails.matchedFeatures.slice(0, 4).map((key) => {
                  const feat = rv.features.find((f) => f.feature.key === key)
                  return (
                    <span key={key} className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                      {feat?.feature.label ?? key}
                    </span>
                  )
                })}
                {rv.matchDetails.matchedFeatures.length > 4 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{rv.matchDetails.matchedFeatures.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
