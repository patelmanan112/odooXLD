const fs = require('fs');

const filepath = 'c:/Users/MANAN/OneDrive/Desktop/odooXld/frontend/src/context/AppContext.jsx';
let content = fs.readFileSync(filepath, 'utf-8');

// 1. Empty initial data arrays
content = content.replace(/export const initialTrips = \[\s*[\s\S]*?\s*\];/m, 'export const initialTrips = [];');
content = content.replace(/export const initialDestinations = \[\s*[\s\S]*?\s*\];/m, 'export const initialDestinations = [];');

// 2. Insert fetchBackendData
const fetchBackendDataCode = `
  const fetchBackendData = async () => {
    if (!token) return;
    try {
      const tripsData = await apiFetch('/api/trips');
      const formattedTrips = tripsData.data.map(t => ({
        id: t.id,
        name: t.title,
        destination: t.title,
        dates: t.startDate && t.endDate ? \`\${new Date(t.startDate).toLocaleDateString()} - \${new Date(t.endDate).toLocaleDateString()}\` : 'TBD',
        durationDays: t.startDate && t.endDate ? Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / (1000 * 60 * 60 * 24)) : 0,
        status: t.status === 'DRAFT' ? 'Draft' : t.status === 'UPCOMING' ? 'Upcoming' : t.status === 'ONGOING' ? 'Ongoing' : 'Completed',
        progressPct: 50,
        estimatedBudget: parseFloat(t.estimatedBudget || 0),
        spentBudget: parseFloat(t.spentBudget || 0),
        coverPhoto: t.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        stops: t.stops ? t.stops.map(s => s.city.name) : [],
        categoryBreakdown: { flights: 0, hotels: 0, food: 0, activities: 0, transport: 0 },
        days: t.stops ? t.stops.map(s => ({
          dayNum: s.stopOrder,
          title: \`Stop in \${s.city.name}\`,
          date: new Date(s.startDate).toLocaleDateString(),
          activities: s.tripActivities ? s.tripActivities.map(ta => ({
            time: ta.time || 'TBD',
            title: ta.activity.name,
            category: ta.activity.category,
            cost: parseFloat(ta.activity.estimatedCost),
            icon: 'MapPin',
            level: ta.activity.effortLevel === 'HIGH' ? 'High' : ta.activity.effortLevel === 'LOW' ? 'Low' : 'Moderate'
          })) : []
        })) : []
      }));
      setTrips(formattedTrips);
      if (formattedTrips.length > 0 && (!selectedTripId || !formattedTrips.find(t => t.id === selectedTripId))) {
        setSelectedTripId(formattedTrips[0].id);
      }

      const citiesData = await apiFetch('/api/cities');
      const formattedDestinations = citiesData.data.map((c, i) => ({
        id: c.id,
        name: c.name,
        country: c.country,
        type: 'Popular',
        duration: '3 Days',
        cost: '₹15,000',
        popular: i < 4,
        image: c.imageUrl || 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80',
        saved: false
      }));
      setDestinations(formattedDestinations);
    } catch (err) {
      console.error('Failed to load backend data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendData();
    } else {
      setTrips([]);
      setDestinations([]);
    }
  }, [isAuthenticated, token]);

  const [trips, setTrips] = useState([]);
`;

content = content.replace('const [trips, setTrips] = useState(initialTrips);', fetchBackendDataCode);
content = content.replace('const [destinations, setDestinations] = useState(initialDestinations);', 'const [destinations, setDestinations] = useState([]);');

// 3. Update addTrip
const newAddTrip = `
  const addTrip = async (newTrip) => {
    try {
      const payload = {
        title: newTrip.name || newTrip.title || 'New Trip',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 5*24*60*60*1000).toISOString(),
        estimatedBudget: newTrip.estimatedBudget || 50000,
        status: (newTrip.status || 'DRAFT').toUpperCase(),
        coverPhoto: newTrip.coverPhoto || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'
      };
      const data = await apiFetch('/api/trips', { method: 'POST', body: JSON.stringify(payload) });
      showToast(\`Trip "\${payload.title}" created successfully! 🎉\`);
      fetchBackendData();
    } catch (err) {
      showToast('Error creating trip: ' + err.message);
    }
  };
`;

content = content.replace(/const addTrip = \(newTrip\) => {[\s\S]*?showToast.*?;\s*};/, newAddTrip);

fs.writeFileSync(filepath, content, 'utf-8');
console.log('Updated AppContext.jsx successfully.');
