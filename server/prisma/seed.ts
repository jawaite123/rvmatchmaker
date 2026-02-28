import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FEATURES = [
  // Sleeping
  { key: 'king_bed', label: 'King Bed' },
  { key: 'queen_bed', label: 'Queen Bed' },
  { key: 'twin_beds', label: 'Twin Beds' },
  { key: 'corner_bed', label: 'Corner Bed' },
  { key: 'murphy_bed', label: 'Murphy Bed' },
  { key: 'bunkhouse', label: 'Bunkhouse' },
  // Bathroom
  { key: 'full_bathroom', label: 'Full Bathroom' },
  { key: 'dry_bath', label: 'Dry Bath' },
  { key: 'wet_bath', label: 'Wet Bath' },
  { key: 'outdoor_shower', label: 'Outdoor Shower' },
  { key: 'tankless_water_heater', label: 'Tankless Water Heater' },
  // Kitchen
  { key: 'outdoor_kitchen', label: 'Outdoor Kitchen' },
  { key: 'residential_fridge', label: 'Residential Refrigerator' },
  { key: 'convection_oven', label: 'Convection Oven' },
  // Climate
  { key: 'ducted_ac', label: 'Ducted A/C' },
  { key: 'dual_ac', label: 'Dual A/C Units' },
  { key: 'heated_tanks', label: 'Heated & Enclosed Tanks' },
  { key: 'fireplace', label: 'Electric Fireplace' },
  { key: 'all_season', label: 'All-Season Package' },
  // Power & Energy
  { key: 'solar', label: 'Solar Panels' },
  { key: 'solar_prep', label: 'Solar Prep' },
  { key: 'lithium_battery', label: 'Lithium Battery Bank' },
  { key: 'inverter', label: 'Power Inverter' },
  { key: '50amp', label: '50-Amp Power' },
  { key: 'generator', label: 'Generator' },
  { key: 'lp_quick_connect', label: 'LP Quick Connect' },
  // Entertainment
  { key: 'outdoor_tv', label: 'Outdoor TV' },
  { key: 'smart_tv', label: 'Smart TV(s)' },
  { key: 'satellite', label: 'Satellite System' },
  { key: 'theater_seating', label: 'Theater Seating' },
  { key: 'usb_charging', label: 'USB Charging Ports' },
  // Convenience & Tech
  { key: 'washer_dryer', label: 'Washer/Dryer' },
  { key: 'backup_camera', label: 'Backup Camera' },
  { key: 'leveling_system', label: 'Auto-Leveling System' },
  { key: 'swivel_cab_seats', label: 'Swivel Cab Seats' },
  // Storage
  { key: 'pass_through_storage', label: 'Pass-Through Storage' },
  { key: 'basement_storage', label: 'Basement Storage' },
  { key: 'slide_toppers', label: 'Slide Toppers' },
  // Comfort
  { key: 'day_night_shades', label: 'Day/Night Shades' },
  { key: 'diesel', label: 'Diesel Engine' },
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
    features: [
      'king_bed', 'full_bathroom', 'dry_bath', 'outdoor_kitchen', 'residential_fridge', 'convection_oven',
      'ducted_ac', 'dual_ac', 'heated_tanks', 'fireplace', 'all_season',
      'solar', 'lithium_battery', 'inverter', '50amp', 'generator', 'lp_quick_connect',
      'outdoor_tv', 'smart_tv', 'satellite', 'theater_seating', 'usb_charging',
      'washer_dryer', 'backup_camera', 'leveling_system', 'swivel_cab_seats',
      'pass_through_storage', 'basement_storage', 'slide_toppers', 'day_night_shades', 'diesel',
    ],
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
    features: [
      'king_bed', 'full_bathroom', 'dry_bath', 'residential_fridge', 'convection_oven',
      'ducted_ac', 'dual_ac', 'heated_tanks', 'fireplace',
      '50amp', 'generator', 'lp_quick_connect',
      'outdoor_tv', 'smart_tv', 'satellite', 'theater_seating',
      'washer_dryer', 'backup_camera', 'leveling_system', 'swivel_cab_seats',
      'slide_toppers', 'day_night_shades', 'diesel',
    ],
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
    features: [
      'twin_beds', 'bunkhouse', 'full_bathroom', 'dry_bath', 'outdoor_kitchen',
      'ducted_ac', 'lp_quick_connect',
      '50amp', 'generator',
      'outdoor_tv', 'backup_camera', 'leveling_system', 'swivel_cab_seats',
      'day_night_shades',
    ],
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
    features: [
      'twin_beds', 'bunkhouse', 'full_bathroom', 'dry_bath', 'outdoor_kitchen',
      'ducted_ac', 'lp_quick_connect',
      '50amp', 'generator',
      'backup_camera', 'leveling_system', 'swivel_cab_seats', 'pet_friendly',
    ],
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
    features: [
      'full_bathroom', 'wet_bath', 'outdoor_shower', 'tankless_water_heater',
      'heated_tanks', 'all_season',
      'solar', 'lithium_battery', 'inverter',
      'smart_tv', 'usb_charging',
      'backup_camera', 'day_night_shades',
    ],
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
    features: [
      'murphy_bed', 'wet_bath', 'outdoor_shower',
      'heated_tanks',
      'solar', 'lithium_battery', 'inverter',
      'smart_tv', 'usb_charging',
      'backup_camera', 'pet_friendly',
    ],
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
    features: [
      'wet_bath', 'heated_tanks', 'all_season',
      'solar', 'solar_prep',
      'usb_charging', 'backup_camera', 'pet_friendly',
    ],
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
    features: [
      'twin_beds', 'bunkhouse', 'full_bathroom', 'dry_bath',
      'ducted_ac', 'lp_quick_connect',
      '50amp', 'generator',
      'outdoor_tv', 'backup_camera', 'leveling_system',
      'pass_through_storage',
    ],
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
    features: [
      'queen_bed', 'full_bathroom', 'dry_bath', 'outdoor_shower',
      'ducted_ac', 'lp_quick_connect',
      '50amp', 'generator',
      'backup_camera', 'pass_through_storage', 'day_night_shades', 'pet_friendly',
    ],
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
    features: [
      'twin_beds', 'bunkhouse', 'full_bathroom', 'dry_bath', 'outdoor_kitchen',
      'ducted_ac', 'lp_quick_connect',
      'generator', 'backup_camera',
    ],
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
    features: [
      'king_bed', 'full_bathroom', 'dry_bath', 'outdoor_kitchen', 'residential_fridge', 'convection_oven',
      'ducted_ac', 'dual_ac', 'heated_tanks', 'fireplace', 'all_season',
      'solar', 'lithium_battery', 'inverter', '50amp', 'lp_quick_connect',
      'smart_tv', 'satellite', 'theater_seating',
      'washer_dryer', 'leveling_system',
      'pass_through_storage', 'basement_storage', 'slide_toppers', 'day_night_shades',
    ],
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
    features: [
      'twin_beds', 'queen_bed', 'bunkhouse', 'full_bathroom', 'dry_bath', 'outdoor_kitchen',
      'ducted_ac', 'fireplace', 'lp_quick_connect',
      '50amp', 'leveling_system',
      'outdoor_tv', 'washer_dryer',
      'pass_through_storage', 'basement_storage', 'slide_toppers',
    ],
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
    features: [
      'king_bed', 'full_bathroom', 'dry_bath', 'outdoor_kitchen', 'residential_fridge', 'convection_oven',
      'ducted_ac', 'fireplace', 'lp_quick_connect',
      'solar', '50amp', 'leveling_system',
      'outdoor_tv',
      'pass_through_storage', 'basement_storage', 'slide_toppers',
    ],
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
    features: [
      'king_bed', 'full_bathroom', 'dry_bath', 'outdoor_kitchen', 'residential_fridge', 'convection_oven',
      'ducted_ac', 'dual_ac', 'heated_tanks', 'fireplace', 'all_season',
      'solar', 'lithium_battery', 'inverter', '50amp', 'lp_quick_connect',
      'smart_tv', 'satellite', 'theater_seating',
      'washer_dryer', 'leveling_system',
      'pass_through_storage', 'basement_storage', 'slide_toppers', 'day_night_shades',
    ],
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
    features: [
      'king_bed', 'full_bathroom', 'dry_bath', 'outdoor_shower', 'tankless_water_heater', 'residential_fridge', 'convection_oven',
      'heated_tanks', 'all_season',
      'solar', 'lithium_battery', 'inverter', '50amp',
      'washer_dryer',
      'pass_through_storage', 'day_night_shades',
    ],
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
    features: [
      'queen_bed', 'full_bathroom', 'dry_bath', 'outdoor_kitchen',
      'heated_tanks', 'all_season', 'lp_quick_connect',
      'solar', '50amp',
      'outdoor_tv', 'slide_toppers', 'pass_through_storage',
    ],
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
    features: [
      'twin_beds', 'bunkhouse', 'full_bathroom', 'dry_bath', 'outdoor_kitchen',
      'lp_quick_connect',
      'outdoor_tv', 'day_night_shades', 'pet_friendly',
    ],
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
    features: [
      'queen_bed', 'full_bathroom', 'dry_bath', 'outdoor_shower',
      'heated_tanks', 'all_season', 'lp_quick_connect',
      'solar', 'solar_prep', 'lithium_battery', '50amp',
      'pet_friendly',
    ],
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
    features: [
      'twin_beds', 'corner_bed', 'bunkhouse', 'full_bathroom', 'dry_bath',
      'lp_quick_connect', 'usb_charging', 'day_night_shades', 'pet_friendly',
    ],
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
    features: ['lp_quick_connect', 'pet_friendly'],
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

  console.log(`\nSeeding complete! Created ${RVS.length} RVs with ${FEATURES.length} features.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
