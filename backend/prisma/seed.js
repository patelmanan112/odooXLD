import { PrismaClient, EffortLevel } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES = [
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    country: 'India',
    description: 'India’s first UNESCO World Heritage City, famous for Sabarmati Ashram, intricate stepwells, textiles, and vibrant night street food markets.',
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    description: 'India’s bustling financial capital, featuring the historic Gateway of India, colonial architecture, Marine Drive, and Bollywood culture.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    description: 'India’s historic capital blending ancient monuments like the Red Fort and Qutub Minar with bustling bazaars and modern avenues.',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    description: 'The Pink City of Rajasthan, renowned for its majestic hilltop Amber Fort, intricate Hawa Mahal, and rich royal heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    description: 'India’s premier coastal retreat, famous for golden sand beaches, UNESCO-listed Portuguese churches, water sports, and lively nightlife.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    country: 'India',
    description: 'The City of Lakes, celebrated for romantic boat rides on Lake Pichola, grand marble palaces, and scenic Aravalli mountain views.',
    imageUrl: 'https://images.unsplash.com/photo-1615837136849-09516e642a49?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    description: 'A picturesque Himalayan hill station in Himachal Pradesh, popular for snow adventure sports in Solang Valley and scenic alpine treks.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    description: 'India’s Silicon Valley and Garden City, known for lush parks like Lalbagh, Tudor-style palaces, and a thriving craft brewery culture.',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    description: 'The City of Pearls, famous for the iconic 16th-century Charminar, massive Golconda Fort, pearl markets, and legendary Hyderabadi biryani.',
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Japan’s ultra-modern capital blending futuristic skyscrapers, neon-lit Shibuya crossing, historic temples, and world-class dining.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
  }
];

const ACTIVITIES = [
  // Ahmedabad (3 activities)
  {
    id: 'ahmedabad-sabarmati-ashram',
    cityId: 'ahmedabad',
    name: 'Sabarmati Ashram Heritage Tour',
    description: 'Explore Mahatma Gandhi’s historic headquarters on the banks of the Sabarmati River, featuring the museum, archive library, and Hriday Kunj.',
    category: 'CULTURE',
    estimatedCost: 200,
    duration: 90,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ahmedabad-heritage-walk',
    cityId: 'ahmedabad',
    name: 'Old City Pols Heritage Walk',
    description: 'Guided morning walk through the 600-year-old walled city, discovering carved wooden pol houses, secret passages, and ancient temples.',
    category: 'HISTORY',
    estimatedCost: 350,
    duration: 150,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ahmedabad-adalaj-stepwell',
    cityId: 'ahmedabad',
    name: 'Adalaj Stepwell Excursion',
    description: 'Visit the magnificent five-story 15th-century Solanki-style stepwell decorated with intricate sandstone carvings and cool subterranean court.',
    category: 'HISTORY',
    estimatedCost: 250,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },

  // Mumbai (3 activities)
  {
    id: 'mumbai-gateway-of-india',
    cityId: 'mumbai',
    name: 'Gateway of India & Colaba Architecture Walk',
    description: 'Marvel at the iconic Indo-Saracenic arch overlooking Mumbai Harbour and take a guided stroll past historic Victorian-Gothic structures.',
    category: 'SIGHTSEEING',
    estimatedCost: 300,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mumbai-marine-drive',
    cityId: 'mumbai',
    name: 'Marine Drive & Queen’s Necklace Promenade',
    description: 'Relax along the C-shaped 3.6-km coastal boulevard during sunset to watch the shimmering city lights and Arabian Sea waves.',
    category: 'CITY',
    estimatedCost: 150,
    duration: 90,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mumbai-elephanta-caves',
    cityId: 'mumbai',
    name: 'Elephanta Caves Island Boat Tour',
    description: 'Ferry ride from Gateway of India to Elephanta Island to explore 5th-century rock-cut cave temples dedicated to Lord Shiva.',
    category: 'HISTORY',
    estimatedCost: 850,
    duration: 240,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
  },

  // Delhi (3 activities)
  {
    id: 'delhi-red-fort',
    cityId: 'delhi',
    name: 'Red Fort Mughal Heritage Tour',
    description: 'Explore the massive red sandstone fortress built by Emperor Shah Jahan, featuring the Diwan-i-Aam, Diwan-i-Khas, and sound-and-light show.',
    category: 'HISTORY',
    estimatedCost: 500,
    duration: 150,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-qutub-minar',
    cityId: 'delhi',
    name: 'Qutub Minar Complex Tour',
    description: 'Marvel at the world’s tallest brick minaret (73 meters) alongside the ancient rust-resistant Iron Pillar and Quwwat-ul-Islam Mosque.',
    category: 'HISTORY',
    estimatedCost: 400,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'delhi-old-delhi-food-walk',
    cityId: 'delhi',
    name: 'Old Delhi Street Food Rickshaw Safari',
    description: 'Cycle-rickshaw journey through Chandni Chowk and Paranthe Wali Gali, tasting legendary Mughlai delicacies, jalebis, and chaat.',
    category: 'FOOD',
    estimatedCost: 750,
    duration: 180,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },

  // Jaipur (3 activities)
  {
    id: 'jaipur-amber-fort',
    cityId: 'jaipur',
    name: 'Amber Fort Hilltop Guided Exploration',
    description: 'Ascend the majestic hilltop fortification overlooking Maota Lake, famous for Sheesh Mahal (Mirror Palace) and Rajput architecture.',
    category: 'CULTURE',
    estimatedCost: 1200,
    duration: 180,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-hawa-mahal',
    cityId: 'jaipur',
    name: 'Hawa Mahal & Pink City Bazaar Walk',
    description: 'Photograph the 953-window honeycomb façade of the Palace of Winds, followed by vibrant shopping for gems and textiles in Johari Bazaar.',
    category: 'SIGHTSEEING',
    estimatedCost: 350,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jaipur-city-palace',
    cityId: 'jaipur',
    name: 'Jaipur City Palace Museum Tour',
    description: 'Discover royal court courtyards, Peacock Gate, royal costume museum, and giant sterling silver vessels in the heart of Old Jaipur.',
    category: 'HISTORY',
    estimatedCost: 700,
    duration: 150,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
  },

  // Goa (3 activities)
  {
    id: 'goa-scuba-diving',
    cityId: 'goa',
    name: 'Scuba Diving Excursion at Grand Island',
    description: 'Underwater adventure off Grand Island with PADI instructors, featuring coral reefs, tropical fish species, and boat lunch.',
    category: 'ADVENTURE',
    estimatedCost: 2500,
    duration: 240,
    effortLevel: EffortLevel.HIGH,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'goa-bom-jesus-basilica',
    cityId: 'goa',
    name: 'Old Goa Heritage Basilica Tour',
    description: 'Visit the 16th-century UNESCO World Heritage Basilica of Bom Jesus containing the sacred mortal remains of St. Francis Xavier.',
    category: 'CULTURE',
    estimatedCost: 200,
    duration: 90,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'goa-baga-beach-watersports',
    cityId: 'goa',
    name: 'Baga Beach Water Sports Combo',
    description: 'High-energy beach activities including parasailing, jet skiing, banana boat rides, and relaxing at coastal shacks.',
    category: 'WATER_SPORTS',
    estimatedCost: 1800,
    duration: 150,
    effortLevel: EffortLevel.HIGH,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },

  // Udaipur (3 activities)
  {
    id: 'udaipur-city-palace',
    cityId: 'udaipur',
    name: 'Udaipur City Palace Complex Tour',
    description: 'Tour Rajasthan’s largest palace complex, featuring Mor Chowk peacock mosaics, Zenana Mahal, and breathtaking views over Lake Pichola.',
    category: 'HISTORY',
    estimatedCost: 600,
    duration: 180,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1615837136849-09516e642a49?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'udaipur-lake-pichola-boat',
    cityId: 'udaipur',
    name: 'Lake Pichola Sunset Boat Cruise',
    description: 'Serene boat excursion past Jag Niwas (Lake Palace) and Jagmandir Island, offering spectacular sunset views of the illuminated city skyline.',
    category: 'SIGHTSEEING',
    estimatedCost: 800,
    duration: 90,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1615837136849-09516e642a49?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'udaipur-monsoon-palace',
    cityId: 'udaipur',
    name: 'Sajjangarh Monsoon Palace Hilltop Visit',
    description: 'Panoramic views from the 19th-century hilltop palace overlooking Udaipur’s lakes, city skyline, and surrounding Aravalli Wildlife Sanctuary.',
    category: 'NATURE',
    estimatedCost: 350,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1615837136849-09516e642a49?auto=format&fit=crop&w=800&q=80'
  },

  // Manali (3 activities)
  {
    id: 'manali-solang-valley',
    cityId: 'manali',
    name: 'Solang Valley Paragliding & Snow Sports',
    description: 'Adrenaline-packed adventure valley featuring tandem paragliding, snow scooters, zorbing, and cable car rides with mountain views.',
    category: 'ADVENTURE',
    estimatedCost: 3200,
    duration: 210,
    effortLevel: EffortLevel.HIGH,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'manali-hadimba-temple',
    cityId: 'manali',
    name: 'Hadimba Devi Temple Pine Forest Visit',
    description: 'Visit the unique 16th-century four-tiered pagoda temple set amidst dense giant cedar (Deodar) forests in Old Manali.',
    category: 'CULTURE',
    estimatedCost: 150,
    duration: 60,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'manali-jogini-waterfall-trek',
    cityId: 'manali',
    name: 'Jogini Waterfall Nature Trek',
    description: 'Scenic hiking trail starting from Vashisht hot springs, winding through apple orchards and pine woods to the cascading Jogini Falls.',
    category: 'ADVENTURE',
    estimatedCost: 400,
    duration: 180,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },

  // Bengaluru (3 activities)
  {
    id: 'bengaluru-lalbagh-garden',
    cityId: 'bengaluru',
    name: 'Lalbagh Botanical Garden & Glass House Tour',
    description: 'Stroll through 240 acres of rare tropical flora, century-old trees, a 3000-million-year-old rock landmark, and the royal Glass House.',
    category: 'NATURE',
    estimatedCost: 200,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bengaluru-palace',
    cityId: 'bengaluru',
    name: 'Bengaluru Palace Heritage Walk',
    description: 'Explore the 19th-century Tudor-style royal residence built by the Wadiyar dynasty, showcasing floral woodcarvings and vintage photos.',
    category: 'HISTORY',
    estimatedCost: 500,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bengaluru-brewery-trail',
    cityId: 'bengaluru',
    name: 'Indiranagar Craft Brewery & Gastropub Trail',
    description: 'Experience Bengaluru’s famous pub culture with microbrewery tours and craft beer tastings paired with local fusion bites.',
    category: 'FOOD',
    estimatedCost: 1500,
    duration: 180,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
  },

  // Hyderabad (3 activities)
  {
    id: 'hyderabad-charminar-bazaar',
    cityId: 'hyderabad',
    name: 'Charminar Heritage & Laad Bazaar Walk',
    description: 'Climb the 1591 iconic 4-arch monument, followed by shopping for traditional lacquer bangles and pearls in vibrant Laad Bazaar.',
    category: 'CULTURE',
    estimatedCost: 350,
    duration: 150,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hyderabad-golconda-fort',
    cityId: 'hyderabad',
    name: 'Golconda Fort Exploration & Sound Show',
    description: 'Tour the massive medieval hill fort famous for acoustic engineering, diamond vaults (Koh-i-Noor home), and evening laser-sound show.',
    category: 'HISTORY',
    estimatedCost: 450,
    duration: 210,
    effortLevel: EffortLevel.MODERATE,
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'hyderabad-hussain-sagar-boat',
    cityId: 'hyderabad',
    name: 'Hussain Sagar Lake & Buddha Statue Boat Cruise',
    description: 'Boat journey across the heart-shaped lake to the monolithic 18-meter granite Buddha statue erected in the center of the lake.',
    category: 'SIGHTSEEING',
    estimatedCost: 300,
    duration: 90,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },

  // Tokyo (3 activities)
  {
    id: 'tokyo-sensoji-asakusa',
    cityId: 'tokyo',
    name: 'Senso-ji Temple & Asakusa Walking Tour',
    description: 'Visit Tokyo’s oldest Buddhist temple (founded in 645 AD), passing through Kaminarimon Gate and shopping along Nakamise Street.',
    category: 'CULTURE',
    estimatedCost: 1000,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-shibuya-food-crawl',
    cityId: 'tokyo',
    name: 'Shibuya Crossing & Izakaya Food Crawl',
    description: 'Walk across the world-famous Shibuya Scramble Crossing, followed by tasting authentic ramen, yakitori, and gyoza in Yokocho alleyways.',
    category: 'FOOD',
    estimatedCost: 3500,
    duration: 180,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-meiji-shrine',
    cityId: 'tokyo',
    name: 'Meiji Jingu Shrine & Harajuku Forest Walk',
    description: 'Tranquil walk through 170 acres of evergreen forest leading to the grand Shinto shrine dedicated to Emperor Meiji.',
    category: 'SIGHTSEEING',
    estimatedCost: 500,
    duration: 120,
    effortLevel: EffortLevel.LOW,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
  }
];

async function seedCities() {
  console.log(`Seeding ${CITIES.length} cities...`);
  for (const cityData of CITIES) {
    await prisma.city.upsert({
      where: { id: cityData.id },
      update: {
        name: cityData.name,
        country: cityData.country,
        description: cityData.description,
        imageUrl: cityData.imageUrl
      },
      create: {
        id: cityData.id,
        name: cityData.name,
        country: cityData.country,
        description: cityData.description,
        imageUrl: cityData.imageUrl
      }
    });
  }
}

async function seedActivities() {
  console.log(`Seeding ${ACTIVITIES.length} activities...`);
  for (const actData of ACTIVITIES) {
    await prisma.activity.upsert({
      where: { id: actData.id },
      update: {
        cityId: actData.cityId,
        name: actData.name,
        description: actData.description,
        category: actData.category,
        estimatedCost: actData.estimatedCost,
        duration: actData.duration,
        imageUrl: actData.imageUrl,
        effortLevel: actData.effortLevel
      },
      create: {
        id: actData.id,
        cityId: actData.cityId,
        name: actData.name,
        description: actData.description,
        category: actData.category,
        estimatedCost: actData.estimatedCost,
        duration: actData.duration,
        imageUrl: actData.imageUrl,
        effortLevel: actData.effortLevel
      }
    });
  }
}

async function main() {
  console.log('🌱 Starting Wanderly database seed...');

  await seedCities();
  await seedActivities();

  const cityCount = await prisma.city.count();
  const activityCount = await prisma.activity.count();

  console.log(`✅ Seed completed successfully with ${cityCount} cities & ${activityCount} activities!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
