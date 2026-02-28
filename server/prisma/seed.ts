import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FEATURES = [
  { key: 'solar', label: 'Solar Panels' },
  { key: 'outdoor_kitchen', label: 'Outdoor Kitchen' },
  { key: 'fireplace', label: 'Electric Fireplace' },
  { key: 'washer_dryer', label: 'Washer/Dryer' },
  { key: 'full_bathroom', label: 'Full Bathroom' },
  { key: 'murphy_bed', label: 'Murphy Bed' },
  { key: 'outdoor_tv', label: 'Outdoor TV' },
  { key: 'generator', label: 'Generator' },
  { key: 'king_bed', label: 'King Bed' },
  { key: 'bunkhouse', label: 'Bunkhouse' },
  { key: 'theater_seating', label: 'Theater Seating' },
  { key: 'outdoor_shower', label: 'Outdoor Shower' },
  { key: 'diesel', label: 'Diesel Engine' },
  { key: 'all_season', label: 'All-Season Package' },
  { key: 'pet_friendly', label: 'Pet-Friendly Features' },
]

const RVS = [
  // Class A Motorhomes
  {
    brand: 'Tiffin',
    model: 'Allegro Bus 45OPP',
    year: 2023,
    type: 'CLASS_A',
    lengthFt: 45,
    sleeps: 6,
    slides: 4,
    weightLbs: 52000,
    msrp: 485000,
    floorplanType: 'REAR_LIVING',
    description: 'Luxury diesel pusher with premium finishes, residential refrigerator, and massive living space.',
    features: ['solar', 'fireplace', 'washer_dryer', 'full_bathroom', 'theater_seating', 'king_bed', 'diesel', 'generator', 'outdoor_tv'],
  },
  {
    brand: 'Winnebago',
    model: 'Grand Tour 45RL',
    year: 2024,
    type: 'CLASS_A',
    lengthFt: 44,
    sleeps: 4,
    slides: 3,
    weightLbs: 48000,
    msrp: 395000,
    floorplanType: 'REAR_LIVING',
    description: 'Upscale diesel coach with rear living room, chef\'s kitchen, and spa-like bathroom.',
    features: ['fireplace', 'washer_dryer', 'full_bathroom', 'king_bed', 'theater_seating', 'diesel', 'generator', 'outdoor_tv'],
  },
  {
    brand: 'Coachmen',
    model: 'Mirada 35OS',
    year: 2023,
    type: 'CLASS_A',
    lengthFt: 35,
    sleeps: 8,
    slides: 2,
    weightLbs: 26000,
    msrp: 145000,
    floorplanType: 'BUNKHOUSE',
    description: 'Family-friendly Class A with front bedroom, bunkhouse, and outdoor kitchen.',
    features: ['outdoor_kitchen', 'full_bathroom', 'bunkhouse', 'outdoor_tv', 'generator'],
  },
  {
    brand: 'Forest River',
    model: 'Georgetown 5 Series 34H5',
    year: 2024,
    type: 'CLASS_A',
    lengthFt: 34,
    sleeps: 10,
    slides: 2,
    weightLbs: 24000,
    msrp: 129000,
    floorplanType: 'BUNKHOUSE',
    description: 'Spacious bunkhouse floor plan perfect for large families with convertible sleeping areas.',
    features: ['full_bathroom', 'bunkhouse', 'generator', 'outdoor_kitchen', 'pet_friendly'],
  },
  // Class B Vans
  {
    brand: 'Airstream',
    model: 'Interstate 24GT',
    year: 2024,
    type: 'CLASS_B',
    lengthFt: 24,
    sleeps: 2,
    slides: 0,
    weightLbs: 10500,
    msrp: 189000,
    floorplanType: 'REAR_BEDROOM',
    description: 'Premium Mercedes-Benz Sprinter-based van with luxury finishes and advanced tech.',
    features: ['solar', 'full_bathroom', 'outdoor_shower', 'all_season'],
  },
  {
    brand: 'Winnebago',
    model: 'Solis 59P',
    year: 2023,
    type: 'CLASS_B',
    lengthFt: 22,
    sleeps: 4,
    slides: 0,
    weightLbs: 8800,
    msrp: 139000,
    floorplanType: 'REAR_LIVING',
    description: 'Versatile van with pop-top roof for extra sleeping, convertible interior layout.',
    features: ['solar', 'murphy_bed', 'outdoor_shower', 'pet_friendly'],
  },
  {
    brand: 'Thor Motor Coach',
    model: 'Sequence 20A',
    year: 2024,
    type: 'CLASS_B',
    lengthFt: 20,
    sleeps: 2,
    slides: 0,
    weightLbs: 7200,
    msrp: 89000,
    floorplanType: 'REAR_BEDROOM',
    description: 'Compact and nimble Class B perfect for couples and solo adventurers.',
    features: ['solar', 'all_season', 'pet_friendly'],
  },
  // Class C Motorhomes
  {
    brand: 'Jayco',
    model: 'Redhawk 31F',
    year: 2024,
    type: 'CLASS_C',
    lengthFt: 31,
    sleeps: 10,
    slides: 2,
    weightLbs: 14500,
    msrp: 135000,
    floorplanType: 'BUNKHOUSE',
    description: 'Family favorite with bunk beds over cab, massive slide-outs, and family entertainment.',
    features: ['bunkhouse', 'full_bathroom', 'outdoor_tv', 'generator'],
  },
  {
    brand: 'Winnebago',
    model: 'Minnie Winnie 31K',
    year: 2023,
    type: 'CLASS_C',
    lengthFt: 31,
    sleeps: 7,
    slides: 1,
    weightLbs: 13200,
    msrp: 115000,
    floorplanType: 'REAR_BEDROOM',
    description: 'Classic Class C with comfortable rear bedroom, full kitchen, and reliable Ford chassis.',
    features: ['full_bathroom', 'generator', 'outdoor_shower', 'pet_friendly'],
  },
  {
    brand: 'Thor Motor Coach',
    model: 'Chateau 28Z',
    year: 2024,
    type: 'CLASS_C',
    lengthFt: 28,
    sleeps: 8,
    slides: 1,
    weightLbs: 11800,
    msrp: 99000,
    floorplanType: 'SPLIT_BATH',
    description: 'Mid-size Class C with split bath, outdoor kitchen, and solid value proposition.',
    features: ['outdoor_kitchen', 'full_bathroom', 'generator', 'bunkhouse'],
  },
  // Fifth Wheels
  {
    brand: 'Grand Design',
    model: 'Solitude 390RK',
    year: 2024,
    type: 'FIFTH_WHEEL',
    lengthFt: 42,
    sleeps: 4,
    slides: 4,
    weightLbs: 16500,
    msrp: 95000,
    floorplanType: 'REAR_LIVING',
    description: 'Luxury fifth wheel with rear living room, residential appliances, and spa bathroom.',
    features: ['fireplace', 'washer_dryer', 'full_bathroom', 'king_bed', 'theater_seating', 'outdoor_kitchen', 'solar', 'all_season'],
  },
  {
    brand: 'Keystone',
    model: 'Montana 3855BR',
    year: 2023,
    type: 'FIFTH_WHEEL',
    lengthFt: 43,
    sleeps: 10,
    slides: 4,
    weightLbs: 15900,
    msrp: 78000,
    floorplanType: 'BUNKHOUSE',
    description: 'Family-sized fifth wheel with triple bunk room, front living, and two full baths.',
    features: ['bunkhouse', 'full_bathroom', 'washer_dryer', 'outdoor_kitchen', 'outdoor_tv', 'fireplace'],
  },
  {
    brand: 'Jayco',
    model: 'North Point 377RLBH',
    year: 2024,
    type: 'FIFTH_WHEEL',
    lengthFt: 40,
    sleeps: 8,
    slides: 3,
    weightLbs: 14200,
    msrp: 82000,
    floorplanType: 'REAR_LIVING',
    description: 'Premium fifth wheel with island kitchen, rear entertainment, and comfort everywhere.',
    features: ['fireplace', 'full_bathroom', 'king_bed', 'outdoor_tv', 'solar', 'outdoor_kitchen'],
  },
  {
    brand: 'Alliance RV',
    model: 'Paradigm 390MP',
    year: 2024,
    type: 'FIFTH_WHEEL',
    lengthFt: 42,
    sleeps: 6,
    slides: 4,
    weightLbs: 17000,
    msrp: 112000,
    floorplanType: 'FRONT_LIVING',
    description: 'Ultra-lux fifth wheel with front bedroom suite, mid-living, and full-length wardrobe.',
    features: ['fireplace', 'washer_dryer', 'full_bathroom', 'king_bed', 'solar', 'all_season', 'outdoor_kitchen', 'theater_seating'],
  },
  // Travel Trailers
  {
    brand: 'Airstream',
    model: 'Classic 33FB',
    year: 2024,
    type: 'TRAVEL_TRAILER',
    lengthFt: 33,
    sleeps: 4,
    slides: 1,
    weightLbs: 8500,
    msrp: 165000,
    floorplanType: 'REAR_BEDROOM',
    description: 'Iconic aluminum travel trailer with timeless design, premium appliances, and full off-road capability.',
    features: ['solar', 'full_bathroom', 'king_bed', 'washer_dryer', 'outdoor_shower', 'all_season'],
  },
  {
    brand: 'Lance',
    model: '2465',
    year: 2023,
    type: 'TRAVEL_TRAILER',
    lengthFt: 26,
    sleeps: 6,
    slides: 2,
    weightLbs: 6900,
    msrp: 58000,
    floorplanType: 'REAR_BEDROOM',
    description: 'Well-built travel trailer with solid construction, rear bedroom, and great livability.',
    features: ['full_bathroom', 'outdoor_kitchen', 'solar', 'all_season', 'outdoor_tv'],
  },
  {
    brand: 'Coachmen',
    model: 'Catalina Legacy 323BHDSLE',
    year: 2024,
    type: 'TRAVEL_TRAILER',
    lengthFt: 36,
    sleeps: 10,
    slides: 2,
    weightLbs: 8200,
    msrp: 49000,
    floorplanType: 'BUNKHOUSE',
    description: 'Budget-friendly bunkhouse trailer with double bunks, outdoor kitchen, and family layout.',
    features: ['bunkhouse', 'outdoor_kitchen', 'full_bathroom', 'outdoor_tv', 'pet_friendly'],
  },
  {
    brand: 'Outdoors RV',
    model: 'Creek Side 21KVS',
    year: 2024,
    type: 'TRAVEL_TRAILER',
    lengthFt: 25,
    sleeps: 4,
    slides: 1,
    weightLbs: 6100,
    msrp: 55000,
    floorplanType: 'REAR_BEDROOM',
    description: 'Built for four-season camping with heated tanks, high R-value insulation, and mountain-ready build.',
    features: ['solar', 'all_season', 'outdoor_shower', 'full_bathroom', 'pet_friendly'],
  },
  {
    brand: 'Winnebago',
    model: 'Micro Minnie 2108DS',
    year: 2023,
    type: 'TRAVEL_TRAILER',
    lengthFt: 23,
    sleeps: 4,
    slides: 0,
    weightLbs: 4200,
    msrp: 34000,
    floorplanType: 'SPLIT_BATH',
    description: 'Light and easy-to-tow travel trailer with split bath, dinette, and rear bunks.',
    features: ['bunkhouse', 'full_bathroom', 'pet_friendly'],
  },
  // Popup
  {
    brand: 'Jayco',
    model: 'Jay Sport 10SD',
    year: 2023,
    type: 'POPUP',
    lengthFt: 19,
    sleeps: 6,
    slides: 0,
    weightLbs: 1900,
    msrp: 18000,
    floorplanType: 'NO_SLIDE',
    description: 'Lightweight and easy-to-store popup camper with soft sides and canvas tent ends.',
    features: ['pet_friendly'],
  },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.rVFeature.deleteMany()
  await prisma.rV.deleteMany()
  await prisma.feature.deleteMany()

  // Create features
  const featureMap: Record<string, number> = {}
  for (const f of FEATURES) {
    const created = await prisma.feature.create({ data: f })
    featureMap[f.key] = created.id
  }
  console.log(`Created ${FEATURES.length} features`)

  // Create RVs
  for (const rv of RVS) {
    const { features, ...rvData } = rv
    const created = await prisma.rV.create({
      data: {
        ...rvData,
        status: 'APPROVED',
        features: {
          create: features.map((key) => ({
            featureId: featureMap[key],
          })),
        },
      },
    })
    console.log(`Created RV: ${created.brand} ${created.model}`)
  }

  console.log(`\nSeeding complete! Created ${RVS.length} RVs.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
