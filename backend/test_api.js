import app from './src/app.js';
import prisma from './src/config/prisma.js';

async function runTests() {
  console.log('=== STARTING BACKEND VERIFICATION TESTS ===');
  let server;
  const PORT = 5005;

  try {
    // 1. Ensure DB connection is active
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Database connected successfully.');

    // 2. Start Server
    await new Promise((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
        resolve();
      });
    });

    const baseUrl = `http://localhost:${PORT}/api`;

    // 3. Health check
    console.log('\n--- 1. Health Check ---');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log('Health Response:', healthRes.status, healthData);
    if (healthRes.status !== 200 || healthData.status !== 'ok') {
      throw new Error('Health check failed!');
    }

    // Generate unique emails for test
    const timestamp = Date.now();
    const userA = {
      name: 'User Alpha',
      email: `user_a_${timestamp}@example.com`,
      password: 'password123'
    };
    const userB = {
      name: 'User Beta',
      email: `user_b_${timestamp}@example.com`,
      password: 'password456'
    };

    // 4. Signup User A
    console.log('\n--- 2. Signup User A ---');
    const signupARes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA)
    });
    const signupAData = await signupARes.json();
    console.log('Signup A Response:', signupARes.status, signupAData.message, signupAData.user);
    if (signupARes.status !== 201 || !signupAData.token) {
      throw new Error('Signup A failed');
    }
    const tokenA = signupAData.token;

    // 5. Duplicate Signup User A
    console.log('\n--- 3. Duplicate Signup ---');
    const dupSignupRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA)
    });
    const dupSignupData = await dupSignupRes.json();
    console.log('Duplicate Signup Response:', dupSignupRes.status, dupSignupData);
    if (dupSignupRes.status !== 409) {
      throw new Error('Duplicate signup expected 409 status');
    }

    // 6. Signup User B
    console.log('\n--- 4. Signup User B ---');
    const signupBRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB)
    });
    const signupBData = await signupBRes.json();
    console.log('Signup B Response:', signupBRes.status, signupBData.message, signupBData.user);
    const tokenB = signupBData.token;

    // 7. Login User A
    console.log('\n--- 5. Login User A ---');
    const loginARes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA.email, password: userA.password })
    });
    const loginAData = await loginARes.json();
    console.log('Login A Response:', loginARes.status, loginAData.message, loginAData.user);
    if (loginARes.status !== 200 || !loginAData.token) {
      throw new Error('Login A failed');
    }

    // 8. Invalid Login
    console.log('\n--- 6. Invalid Login ---');
    const invalidLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA.email, password: 'wrongpassword' })
    });
    console.log('Invalid Login Response:', invalidLoginRes.status);
    if (invalidLoginRes.status !== 401) {
      throw new Error('Invalid login expected 401 status');
    }

    // 9. Protected Endpoint Without Token
    console.log('\n--- 7. Unauthenticated Trip Access ---');
    const unauthRes = await fetch(`${baseUrl}/trips`);
    console.log('Unauth Response:', unauthRes.status);
    if (unauthRes.status !== 401) {
      throw new Error('Unauthenticated request expected 401 status');
    }

    // 10. Trip Validation Error Tests
    console.log('\n--- 8. Trip Validation Error Tests ---');
    // Invalid status
    const invalidStatusRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Test Trip', status: 'INVALID_STATUS' })
    });
    if (invalidStatusRes.status !== 400) throw new Error('Invalid status expected 400');

    // Negative estimatedBudget
    const negEstRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Test Trip', estimatedBudget: -500 })
    });
    if (negEstRes.status !== 400) throw new Error('Negative budget expected 400');

    // Invalid date range (endDate before startDate)
    const invalidDatesRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Test Trip', startDate: '2026-10-10', endDate: '2026-10-01' })
    });
    if (invalidDatesRes.status !== 400) throw new Error('Invalid date range expected 400');

    console.log('Validation error tests passed!');

    // 11. Create Basic Trip (User A)
    console.log('\n--- 9. Create Basic Trip (User A) ---');
    const createTripRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Rajasthan Royal Tour',
        description: 'Exploring Jaipur, Udaipur, and Jaisalmer',
        startDate: '2026-10-01',
        endDate: '2026-10-10'
      })
    });
    const tripAData = await createTripRes.json();
    console.log('Create Basic Trip Response:', createTripRes.status, tripAData);
    if (createTripRes.status !== 201 || !tripAData.id || tripAData.status !== 'DRAFT') {
      throw new Error('Create basic trip failed');
    }
    const tripId = tripAData.id;

    // 12. Create Enhanced Trip with all fields (User A)
    console.log('\n--- 10. Create Enhanced Trip (User A) ---');
    const createEnhancedRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Japan Autumn Adventure',
        description: 'Tokyo and Kyoto in Autumn',
        startDate: '2026-11-01',
        endDate: '2026-11-12',
        estimatedBudget: 150000,
        spentBudget: 45000,
        status: 'UPCOMING',
        coverPhoto: 'https://example.com/japan.jpg',
        isPublic: true
      })
    });
    const tripEnhancedData = await createEnhancedRes.json();
    console.log('Create Enhanced Trip Response:', createEnhancedRes.status, tripEnhancedData);
    if (
      createEnhancedRes.status !== 201 ||
      tripEnhancedData.estimatedBudget !== 150000 ||
      tripEnhancedData.status !== 'UPCOMING' ||
      tripEnhancedData.isPublic !== true
    ) {
      throw new Error('Create enhanced trip failed');
    }

    // 13. List Trips with Status Filtering (User A)
    console.log('\n--- 11. Get Trips & Status Filtering (User A) ---');
    const getTripsARes = await fetch(`${baseUrl}/trips`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const tripsA = await getTripsARes.json();
    console.log('All Trips Count for User A:', tripsA.length);
    if (tripsA.length !== 2) throw new Error('Expected 2 trips for User A');

    const getUpcomingRes = await fetch(`${baseUrl}/trips?status=UPCOMING`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const upcomingTrips = await getUpcomingRes.json();
    console.log('Upcoming Trips Count:', upcomingTrips.length, upcomingTrips[0]?.title);
    if (upcomingTrips.length !== 1 || upcomingTrips[0].title !== 'Japan Autumn Adventure') {
      throw new Error('Status filter UPCOMING failed');
    }

    // 14. List Trips (User B - should be empty)
    console.log('\n--- 12. Get Trips (User B) ---');
    const getTripsBRes = await fetch(`${baseUrl}/trips`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    const tripsB = await getTripsBRes.json();
    console.log('Get Trips B Response:', getTripsBRes.status, 'Count:', tripsB.length);
    if (tripsB.length !== 0) {
      throw new Error('User B saw trips belonging to User A!');
    }

    // Seed temporary City & Activity to test Full Itinerary Retrieval
    console.log('\n--- 13. Seeding City & Activity for Itinerary Test ---');
    const city = await prisma.city.create({
      data: {
        name: 'Udaipur',
        country: 'India',
        description: 'City of Lakes',
        imageUrl: 'https://example.com/udaipur.jpg'
      }
    });

    const activity = await prisma.activity.create({
      data: {
        cityId: city.id,
        name: 'City Palace Tour',
        description: 'Historic palace visit',
        category: 'Culture',
        estimatedCost: 350.00,
        duration: 3,
        imageUrl: 'https://example.com/citypalace.jpg'
      }
    });

    const stop = await prisma.tripStop.create({
      data: {
        tripId: tripId,
        cityId: city.id,
        startDate: new Date('2026-10-02'),
        endDate: new Date('2026-10-04'),
        stopOrder: 1
      }
    });

    await prisma.tripActivity.create({
      data: {
        tripStopId: stop.id,
        activityId: activity.id,
        date: new Date('2026-10-03')
      }
    });

    // 15. GET /api/trips/:id (User A - Full Itinerary with enhanced fields)
    console.log('\n--- 14. Get Trip By ID (User A - Full Itinerary) ---');
    const fullTripRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const fullTripData = await fullTripRes.json();
    console.log('Full Trip Response Status:', fullTripRes.status);
    console.log('Full Trip Title:', fullTripData.title);
    console.log('Full Trip Status:', fullTripData.status);
    console.log('Full Trip Estimated Budget:', fullTripData.estimatedBudget);
    console.log('Full Trip Stops Count:', fullTripData.stops?.length);

    if (
      fullTripRes.status !== 200 ||
      fullTripData.stops?.length !== 1 ||
      fullTripData.stops[0].city.name !== 'Udaipur' ||
      fullTripData.stops[0].tripActivities[0].activity.estimatedCost !== 350
    ) {
      throw new Error('Full nested itinerary endpoint test failed!');
    }

    // 16. User B Access User A Trip (Ownership Enforcement)
    console.log('\n--- 15. User B Access User A Trip (Ownership Isolation) ---');
    const userBAccessRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    console.log('User B Access Status:', userBAccessRes.status);
    if (userBAccessRes.status !== 404) {
      throw new Error('User B was able to access User A trip!');
    }

    // 17. PUT /api/trips/:id (Update Trip - Budgets, Status, Visibility)
    console.log('\n--- 16. Update Trip (User A) ---');
    const updateRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: 'Updated Rajasthan Expedition',
        estimatedBudget: 120000,
        spentBudget: 35000,
        status: 'ONGOING',
        isPublic: true,
        coverPhoto: 'https://example.com/rajasthan.jpg'
      })
    });
    const updateData = await updateRes.json();
    console.log('Update Trip Response:', updateRes.status, updateData);
    if (
      updateRes.status !== 200 ||
      updateData.title !== 'Updated Rajasthan Expedition' ||
      updateData.estimatedBudget !== 120000 ||
      updateData.status !== 'ONGOING' ||
      updateData.isPublic !== true
    ) {
      throw new Error('Update trip failed!');
    }

    // 18. Partial Update Verification (Unspecified fields remain unchanged)
    console.log('\n--- 17. Partial Update Verification ---');
    const partialUpdateRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        spentBudget: 40000
      })
    });
    const partialData = await partialUpdateRes.json();
    console.log('Partial Update Response:', partialData.spentBudget, partialData.title, partialData.status);
    if (
      partialData.spentBudget !== 40000 ||
      partialData.title !== 'Updated Rajasthan Expedition' ||
      partialData.status !== 'ONGOING'
    ) {
      throw new Error('Partial update broke existing field values!');
    }

    // 19. Cities API Test
    console.log('\n--- 18. GET /api/cities & Search ---');
    const citiesRes = await fetch(`${baseUrl}/cities`);
    const citiesData = await citiesRes.json();
    console.log('Cities count:', citiesData.length);

    const searchCityRes = await fetch(`${baseUrl}/cities?search=udaipur`);
    const searchCityData = await searchCityRes.json();
    console.log('Search Udaipur count:', searchCityData.length, searchCityData[0]?.name);
    if (searchCityData.length !== 1 || searchCityData[0].name !== 'Udaipur') {
      throw new Error('City search failed!');
    }

    // 20. Activities API Test
    console.log('\n--- 19. GET /api/activities with filters ---');
    const actCityRes = await fetch(`${baseUrl}/activities?cityId=${city.id}`);
    const actCityData = await actCityRes.json();
    console.log('Activities by cityId count:', actCityData.length, actCityData[0]?.name);

    const actSearchRes = await fetch(`${baseUrl}/activities?search=palace`);
    const actSearchData = await actSearchRes.json();
    console.log('Activities search "palace" count:', actSearchData.length, actSearchData[0]?.name);

    if (actCityData.length !== 1 || actSearchData.length !== 1) {
      throw new Error('Activity filters test failed!');
    }

    // 21. Delete Trip
    console.log('\n--- 20. DELETE /api/trips/:id ---');
    const deleteRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const deleteData = await deleteRes.json();
    console.log('Delete Response:', deleteRes.status, deleteData);
    if (deleteRes.status !== 200) {
      throw new Error('Delete trip failed!');
    }

    // Clean up seeded City & test records from DB
    await prisma.city.delete({ where: { id: city.id } });
    await prisma.user.deleteMany({
      where: { email: { in: [userA.email, userB.email] } }
    });

    console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
      console.log('Test server closed.');
    }
    await prisma.$disconnect();
  }
}

runTests();
