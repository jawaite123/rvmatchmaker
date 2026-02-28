export interface Preferences {
  // Step 1: Non-negotiables
  rvTypes: string[]
  maxLengthFt: number | null
  minSleeps: number | null
  mustHaveFeatures: string[] // feature keys

  // Step 2: Feature ranking (ordered list, index 0 = most important)
  rankedFeatures: string[] // feature keys in priority order

  // Step 3: Floorplan preferences
  preferredFloorplans: string[]
  mustHaveFloorplans: string[]
}

export interface RVWithFeatures {
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
  features: Array<{ feature: { key: string; label: string } }>
}

export interface ScoredRV extends RVWithFeatures {
  score: number
  matchDetails: {
    featureScore: number
    floorplanBonus: number
    matchedFeatures: string[]
    missingFeatures: string[]
  }
}

export function scoreAndRank(rvs: RVWithFeatures[], prefs: Preferences): ScoredRV[] {
  const results: ScoredRV[] = []

  for (const rv of rvs) {
    const rvFeatureKeys = rv.features.map((f) => f.feature.key)

    // Step 1: Hard filters
    if (prefs.rvTypes.length > 0 && !prefs.rvTypes.includes(rv.type)) continue
    if (prefs.maxLengthFt !== null && rv.lengthFt > prefs.maxLengthFt) continue
    if (prefs.minSleeps !== null && rv.sleeps < prefs.minSleeps) continue
    if (prefs.mustHaveFeatures.some((key) => !rvFeatureKeys.includes(key))) continue
    if (prefs.mustHaveFloorplans?.length > 0 && !prefs.mustHaveFloorplans.includes(rv.floorplanType)) continue

    // Step 2: Feature score
    let featureScore = 0
    const matchedFeatures: string[] = []
    const missingFeatures: string[] = []
    const maxRankCount = prefs.rankedFeatures.length

    prefs.rankedFeatures.forEach((key, index) => {
      if (rvFeatureKeys.includes(key)) {
        // rank 1 (index 0) = maxRankCount points, rank last = 1 point
        featureScore += maxRankCount - index
        matchedFeatures.push(key)
      } else {
        missingFeatures.push(key)
      }
    })

    // Step 3: Floorplan bonus
    const floorplanBonus =
      prefs.preferredFloorplans.length > 0 && prefs.preferredFloorplans.includes(rv.floorplanType) ? 15 : 0

    // Normalize to 0–100
    const maxPossibleFeatureScore = maxRankCount > 0
      ? Array.from({ length: maxRankCount }, (_, i) => maxRankCount - i).reduce((a, b) => a + b, 0)
      : 1
    const maxPossibleScore = maxPossibleFeatureScore + 15

    const rawScore = featureScore + floorplanBonus
    const score = maxPossibleScore > 0 ? Math.round((rawScore / maxPossibleScore) * 100) : 50

    results.push({
      ...rv,
      score: Math.min(100, score),
      matchDetails: {
        featureScore,
        floorplanBonus,
        matchedFeatures,
        missingFeatures,
      },
    })
  }

  return results.sort((a, b) => b.score - a.score)
}
