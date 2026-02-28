import { FLOORPLAN_TYPES } from '../lib/api'

const FLOORPLAN_ICONS: Record<string, string> = {
  BUNKHOUSE: '🛏️',
  REAR_LIVING: '🛋️',
  FRONT_LIVING: '🪑',
  REAR_BEDROOM: '🚪',
  SPLIT_BATH: '🚿',
  SINGLE_SLIDE: '↔️',
  NO_SLIDE: '📦',
}

interface Props {
  preferredFloorplans: string[]
  onChange: (plans: string[]) => void
}

export default function StepFloorplan({ preferredFloorplans, onChange }: Props) {
  const toggle = (value: string) => {
    if (preferredFloorplans.includes(value)) {
      onChange(preferredFloorplans.filter((v) => v !== value))
    } else if (preferredFloorplans.length < 3) {
      onChange([...preferredFloorplans, value])
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">Preferred floorplan layouts</h3>
      <p className="text-sm text-gray-500 mb-4">Pick up to 3. Matching a preferred layout adds a bonus score.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FLOORPLAN_TYPES.map((fp) => {
          const selected = preferredFloorplans.includes(fp.value)
          const disabled = !selected && preferredFloorplans.length >= 3
          return (
            <button
              key={fp.value}
              type="button"
              onClick={() => toggle(fp.value)}
              disabled={disabled}
              className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                selected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : disabled
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <span className="text-3xl">{FLOORPLAN_ICONS[fp.value]}</span>
              <div>
                <div className="font-semibold">{fp.label}</div>
                <div className={`text-sm mt-0.5 ${selected ? 'text-blue-100' : 'text-gray-500'}`}>
                  {fp.description}
                </div>
              </div>
              {selected && <span className="ml-auto text-xl">✓</span>}
            </button>
          )
        })}
      </div>

      {preferredFloorplans.length === 3 && (
        <p className="text-xs text-orange-500 mt-3">Maximum 3 selections reached. Deselect one to choose another.</p>
      )}
    </div>
  )
}
