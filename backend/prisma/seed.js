import { PrismaClient, EffortLevel } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES = [
  { name: 'Ahmedabad', country: 'India', description: 'Heritage city known for Sabarmati Ashram, textiles, and street food.', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mumbai', country: 'India', description: 'Financial capital with iconic Gateway of India and Marine Drive.', imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Delhi', country: 'India', description: 'Historic capital with Mughal monuments and vibrant bazaars.', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Jaipur', country: 'India', description: 'The Pink City famous for Hawa Mahal, Amber Fort, and royal palaces.', imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80' },
  { name: 'Goa', country: 'India', description: 'Tropical paradise known for sun-kissed beaches and Portuguese architecture.', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Udaipur', country: 'India', description: 'City of Lakes with majestic City Palace and romantic boat rides.', imageUrl: 'https://images.unsplash.com/photo-1615837136849-09516e642a49?auto=format&fit=crop&w=600&q=80' },
  { name: 'Manali', country: 'India', description: 'Himalayan mountain town known for snow slopes and adventure sports.', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
  { name: 'Bangalore', country: 'India', description: 'Garden City and tech hub with lush parks and craft breweries.', imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Hyderabad', country: 'India', description: 'City of Pearls famous for Charminar and world-renowned Biryani.', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80' },
  { name: 'Tokyo', country: 'Japan', description: 'Ultra-modern metropolis blending neon skyscrapers and ancient shrines.', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' }
];

const ACTIVITIES_DATA = {
  Goa: [
    { name: 'Scuba Diving at Grand Island', category: 'Adventure', estimatedCost: 2500, duration: 180, effortLevel: EffortLevel.HIGH, description: 'Underwater coral reef exploration with certified diving instructors.' },
    { name: 'Water Sports Combo at Calangute', category: 'Water Sports', estimatedCost: 1800, duration: 120, effortLevel: EffortLevel.HIGH, description: 'Jet ski, parasailing, and banana boat rides.' },
    { name: 'Mandovi River Sunset Cruise', category: 'Sightseeing', estimatedCost: 600, duration: 90, effortLevel: EffortLevel.LOW, description: 'Scenic river cruise with traditional Goan folk dance performances.' }
  ],
  Manali: [
    { name: 'Paragliding in Solang Valley', category: 'Adventure', estimatedCost: 3200, duration: 60, effortLevel: EffortLevel.HIGH, description: 'Soar above snow-capped Himalayan peaks.' },
    { name: 'Solang Valley Snow Scooter Ride', category: 'Adventure', estimatedCost: 1500, duration: 30, effortLevel: EffortLevel.MODERATE, description: 'Thrilling snow ride through mountain tracks.' },
    { name: 'Trek to Jogini Waterfall', category: 'Trekking', estimatedCost: 400, duration: 150, effortLevel: EffortLevel.MODERATE, description: 'Scenic nature trail starting from Vashisht village.' }
  ],
  Jaipur: [
    { name: 'Amber Fort Elephant Safari & Guided Tour', category: 'Culture', estimatedCost: 1200, duration: 150, effortLevel: EffortLevel.MODERATE, description: 'Historic hilltop fort exploration with royal views.' },
    { name: 'Hawa Mahal & Johari Bazaar Walk', category: 'Sightseeing', estimatedCost: 300, duration: 120, effortLevel: EffortLevel.LOW, description: 'Iconic Palace of Winds photo stop and street shopping.' }
  ],
  Udaipur: [
    { name: 'Lake Pichola Boat Ride to Jagmandir Palace', category: 'Sightseeing', estimatedCost: 800, duration: 90, effortLevel: EffortLevel.LOW, description: 'Sunset boat ride across tranquil waters.' },
    { name: 'City Palace Guided Heritage Tour', category: 'Culture', estimatedCost: 500, duration: 120, effortLevel: EffortLevel.MODERATE, description: 'Explore royal courtyards, armory, and crystal galleries.' }
  ],
  Mumbai: [
    { name: 'Gateway of India & Colaba Heritage Walk', category: 'Sightseeing', estimatedCost: 300, duration: 120, effortLevel: EffortLevel.LOW, description: 'Colonial architecture walk and harbor views.' },
    { name: 'Elephanta Caves Boat Excursion', category: 'Culture', estimatedCost: 850, duration: 240, effortLevel: EffortLevel.MODERATE, description: 'UNESCO World Heritage rock-cut cave temples.' }
  ],
  Delhi: [
    { name: 'Old Delhi Street Food & Rickshaw Tour', category: 'Food', estimatedCost: 750, duration: 180, effortLevel: EffortLevel.MODERATE, description: 'Taste famous Paranthe Wali Gali and Chandni Chowk snacks.' },
    { name: 'Qutub Minar & Humayun Tomb Tour', category: 'Culture', estimatedCost: 400, duration: 150, effortLevel: EffortLevel.MODERATE, description: 'Mughal architectural monuments.' }
  ],
  Tokyo: [
    { name: 'Shibuya Ramen & Food Crawl', category: 'Food', estimatedCost: 3500, duration: 180, effortLevel: EffortLevel.LOW, description: 'Taste authentic tonkotsu ramen and gyoza in Shibuya.' },
    { name: 'Senso-ji Temple & Asakusa Walking Tour', category: 'Sightseeing', estimatedCost: 1000, duration: 120, effortLevel: EffortLevel.LOW, description: 'Tokyo oldest Buddhist temple and Nakamise shopping street.' },
    { name: 'TeamLab Planets Digital Art Museum', category: 'Sightseeing', estimatedCost: 2800, duration: 120, effortLevel: EffortLevel.LOW, description: 'Immersive body-on digital art installation.' }
  ],
  Ahmedabad: [
    { name: 'Sabarmati Ashram Heritage Tour', category: 'Culture', estimatedCost: 200, duration: 90, effortLevel: EffortLevel.LOW, description: 'Historic home of Mahatma Gandhi.' },
    { name: 'Manek Chowk Night Food Market Tour', category: 'Food', estimatedCost: 500, duration: 120, effortLevel: EffortLevel.LOW, description: 'Famous midnight street food scene.' }
  ],
  Bangalore: [
    { name: 'Cubbon Park Nature Walk & Brewpub Trail', category: 'Food', estimatedCost: 1200, duration: 180, effortLevel: EffortLevel.LOW, description: 'Lush green park walk followed by Indiranagar craft beer tasting.' }
  ],
  Hyderabad: [
    { name: 'Charminar & Laad Bazaar Pearl Shopping', category: 'Sightseeing', estimatedCost: 400, duration: 120, effortLevel: EffortLevel.MODERATE, description: 'Historic monument tour and bangles market.' }
  ]
};

async function main() {
  console.log('🌱 Starting Wanderly database seed...');

  for (const cData of CITIES) {
    const city = await prisma.city.upsert({
      where: { id: cData.name.toLowerCase() },
      update: { description: cData.description, imageUrl: cData.imageUrl },
      create: {
        id: cData.name.toLowerCase(),
        name: cData.name,
        country: cData.country,
        description: cData.description,
        imageUrl: cData.imageUrl
      }
    });

    const actList = ACTIVITIES_DATA[cData.name] || [];
    for (const aData of actList) {
      const actId = `${cData.name.toLowerCase()}-${aData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      await prisma.activity.upsert({
        where: { id: actId },
        update: {
          estimatedCost: aData.estimatedCost,
          duration: aData.duration,
          description: aData.description
        },
        create: {
          id: actId,
          cityId: city.id,
          name: aData.name,
          category: aData.category,
          estimatedCost: aData.estimatedCost,
          duration: aData.duration,
          effortLevel: aData.effortLevel,
          description: aData.description,
          imageUrl: cData.imageUrl
        }
      });
    }
  }

  console.log('✅ Seed completed successfully with 10 cities & 20+ activities!');
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
