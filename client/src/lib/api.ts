export interface Feature {
  id: number
  key: string
  label: string
}

export interface RVFeatureJoin {
  feature: Feature
}

export interface RV {
  id: number
  brand: string
  model: string
  year: number
  type: string
  lengthFt: number
  sleeps: number
  slides: number
  weightLbs: number | null
  msrp: number | null
  floorplanType: string
  floorplanUrl: string | null
  description: string | null
  imageUrl: string | null
  status: string
  submittedBy: string | null
  features: RVFeatureJoin[]
  createdAt: string
}

export interface ScoredRV extends RV {
  score: number
  matchDetails: {
    featureScore: number
    floorplanBonus: number
    matchedFeatures: string[]
    missingFeatures: string[]
  }
}

export interface MatchPreferences {
  rvTypes: string[]
  maxLengthFt: number | null
  minSleeps: number | null
  mustHaveFeatures: string[]
  rankedFeatures: string[]
  preferredFloorplans: string[]
}

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  getRVs: () => request<RV[]>('/rvs'),
  getRV: (id: number) => request<RV>(`/rvs/${id}`),
  getFeatures: () => request<Feature[]>('/features'),
  match: (prefs: MatchPreferences) =>
    request<ScoredRV[]>('/match', { method: 'POST', body: JSON.stringify(prefs) }),
  submit: (data: Record<string, unknown>) =>
    request<{ message: string; rv: RV }>('/submit', { method: 'POST', body: JSON.stringify(data) }),
  admin: {
    getSubmissions: () => request<RV[]>('/admin/submissions'),
    review: (id: number, action: 'approve' | 'reject') =>
      request<RV>(`/admin/submissions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      }),
  },
}

export const RV_TYPES = [
  { value: 'CLASS_A', label: 'Class A Motorhome' },
  { value: 'CLASS_B', label: 'Class B Van' },
  { value: 'CLASS_C', label: 'Class C Motorhome' },
  { value: 'FIFTH_WHEEL', label: 'Fifth Wheel' },
  { value: 'TRAVEL_TRAILER', label: 'Travel Trailer' },
  { value: 'POPUP', label: 'Popup Camper' },
  { value: 'TRUCK_CAMPER', label: 'Truck Camper' },
]

export const FLOORPLAN_TYPES = [
  { value: 'BUNKHOUSE', label: 'Bunkhouse', description: 'Dedicated bunk area for kids or extra guests' },
  { value: 'REAR_LIVING', label: 'Rear Living', description: 'Living room in the rear, bedroom up front' },
  { value: 'FRONT_LIVING', label: 'Front Living', description: 'Living area at the front, bedroom in rear' },
  { value: 'REAR_BEDROOM', label: 'Rear Bedroom', description: 'Private rear bedroom suite' },
  { value: 'SPLIT_BATH', label: 'Split Bath', description: 'Bathroom split between toilet and shower' },
  { value: 'SINGLE_SLIDE', label: 'Single Slide', description: 'One slide-out for extra space' },
  { value: 'NO_SLIDE', label: 'No Slide', description: 'Compact, no slide-outs' },
]
