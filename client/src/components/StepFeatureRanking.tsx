import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Feature {
  id: number
  key: string
  label: string
}

interface SortableItemProps {
  feature: Feature
  index: number
}

function SortableItem({ feature, index }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: feature.key,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-white border rounded-lg px-4 py-3 shadow-sm select-none ${
        isDragging ? 'opacity-60 shadow-lg border-blue-400' : 'border-gray-200'
      }`}
    >
      <span className="text-blue-700 font-bold text-sm w-6 text-center">{index + 1}</span>
      <span
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing px-1"
        title="Drag to reorder"
      >
        ⠿
      </span>
      <span className="flex-1 text-sm font-medium text-gray-800">{feature.label}</span>
      <span className="text-xs text-gray-400">
        {index === 0 ? '10 pts' : index === 1 ? '9 pts' : `${Math.max(1, 10 - index)} pts`}
      </span>
    </div>
  )
}

interface Props {
  rankedFeatures: string[]
  features: Feature[]
  onChange: (ranked: string[]) => void
}

export default function StepFeatureRanking({ rankedFeatures, features, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const orderedFeatures = rankedFeatures
    .map((key) => features.find((f) => f.key === key))
    .filter(Boolean) as Feature[]

  const unselected = features.filter((f) => !rankedFeatures.includes(f.key))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = rankedFeatures.indexOf(String(active.id))
      const newIndex = rankedFeatures.indexOf(String(over.id))
      onChange(arrayMove(rankedFeatures, oldIndex, newIndex))
    }
  }

  const addFeature = (key: string) => {
    onChange([...rankedFeatures, key])
  }

  const removeFeature = (key: string) => {
    onChange(rankedFeatures.filter((k) => k !== key))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Rank features by importance</h3>
        <p className="text-sm text-gray-500 mb-4">
          Drag to reorder. #1 = most important (10 pts), lower ranks score less. Add features from the pool below.
        </p>

        {orderedFeatures.length === 0 && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            Add features from the pool below to start ranking
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedFeatures.map((f) => f.key)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {orderedFeatures.map((feature, index) => (
                <div key={feature.key} className="relative">
                  <SortableItem feature={feature} index={index} />
                  <button
                    type="button"
                    onClick={() => removeFeature(feature.key)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-400 text-lg leading-none px-1"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {unselected.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Feature pool — click to add:</h4>
          <div className="flex flex-wrap gap-2">
            {unselected.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => addFeature(f.key)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-800 border border-gray-200 hover:border-blue-300 rounded-full transition-colors"
              >
                + {f.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
