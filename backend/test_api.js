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

    // 4. Check email (Non-existent)
    console.log('\n--- 2. Check Non-existent Email ---');
    const checkEmail1Res = await fetch(`${baseUrl}/auth/check-email?email=${encodeURIComponent(userA.email)}`);
    const checkEmail1Data = await checkEmail1Res.json();
    console.log('Check Email Response (Non-existent):', checkEmail1Res.status, checkEmail1Data);
    if (checkEmail1Res.status !== 200 || checkEmail1Data.exists !== false) {
      throw new Error('Check email non-existent failed');
    }

    // 5. Signup User A
    console.log('\n--- 3. Signup User A ---');
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

    // 6. Check email (Existing user, normalized case check)
    console.log('\n--- 4. Check Existing Email (Normalized Case) ---');
    const upperEmail = userA.email.toUpperCase();
    const checkEmail2Res = await fetch(`${baseUrl}/auth/check-email?email=${encodeURIComponent(upperEmail)}`);
    const checkEmail2Data = await checkEmail2Res.json();
    console.log('Check Email Response (Existing):', checkEmail2Res.status, checkEmail2Data);
    if (checkEmail2Res.status !== 200 || checkEmail2Data.exists !== true) {
      throw new Error('Check email existing failed');
    }

    // 7. GET /api/auth/me (Verification endpoint)
    console.log('\n--- 5. GET /api/auth/me ---');
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const meData = await meRes.json();
    console.log('Get Me Response:', meRes.status, meData.user);
    if (meRes.status !== 200 || meData.user.email !== userA.email) {
      throw new Error('GET /api/auth/me failed');
    }

    // 8. Duplicate Signup User A
    console.log('\n--- 6. Duplicate Signup ---');
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

    // 9. Signup User B
    console.log('\n--- 7. Signup User B ---');
    const signupBRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB)
    });
    const signupBData = await signupBRes.json();
    console.log('Signup B Response:', signupBRes.status, signupBData.message, signupBData.user);
    const tokenB = signupBData.token;

    // 10. Login User A
    console.log('\n--- 8. Login User A ---');
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

    // 11. Invalid Login
    console.log('\n--- 9. Invalid Login ---');
    const invalidLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA.email, password: 'wrongpassword' })
    });
    console.log('Invalid Login Response:', invalidLoginRes.status);
    if (invalidLoginRes.status !== 401) {
      throw new Error('Invalid login expected 401 status');
    }

    // 12. Protected Endpoint Without Token
    console.log('\n--- 10. Unauthenticated Trip Access ---');
    const unauthRes = await fetch(`${baseUrl}/trips`);
    console.log('Unauth Response:', unauthRes.status);
    if (unauthRes.status !== 401) {
      throw new Error('Unauthenticated request expected 401 status');
    }

    // 13. Trip Validation Error Tests
    console.log('\n--- 11. Trip Validation Error Tests ---');
    const invalidStatusRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Test Trip', status: 'INVALID_STATUS' })
    });
    if (invalidStatusRes.status !== 400) throw new Error('Invalid status expected 400');

    const negEstRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Test Trip', estimatedBudget: -500 })
    });
    if (negEstRes.status !== 400) throw new Error('Negative budget expected 400');

    const invalidDatesRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Test Trip', startDate: '2026-10-10', endDate: '2026-10-01' })
    });
    if (invalidDatesRes.status !== 400) throw new Error('Invalid date range expected 400');

    console.log('Validation error tests passed!');

    // 14. Create Basic Trip (User A)
    console.log('\n--- 12. Create Basic Trip (User A) ---');
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

    // 15. Create Enhanced Trip with all fields (User A)
    console.log('\n--- 13. Create Enhanced Trip (User A) ---');
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

    // 16. List Trips with Status Filtering (User A)
    console.log('\n--- 14. Get Trips & Status Filtering (User A) ---');
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

    // 17. List Trips (User B - should be empty)
    console.log('\n--- 15. Get Trips (User B) ---');
    const getTripsBRes = await fetch(`${baseUrl}/trips`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    const tripsB = await getTripsBRes.json();
    console.log('Get Trips B Response:', getTripsBRes.status, 'Count:', tripsB.length);
    if (tripsB.length !== 0) {
      throw new Error('User B saw trips belonging to User A!');
    }

    // 18. Seed Test Cities
    console.log('\n--- 16. Seeding Test Cities ---');
    const city1 = await prisma.city.create({
      data: { name: 'Jaipur', country: 'India', description: 'Pink City', imageUrl: 'https://example.com/jaipur.jpg' }
    });
    const city2 = await prisma.city.create({
      data: { name: 'Udaipur', country: 'India', description: 'City of Lakes', imageUrl: 'https://example.com/udaipur.jpg' }
    });
    const city3 = await prisma.city.create({
      data: { name: 'Jaisalmer', country: 'India', description: 'Golden City', imageUrl: 'https://example.com/jaisalmer.jpg' }
    });

    // 19. PART 2: TripStop Management Tests
    console.log('\n--- 17. PART 2: TripStop Validation & Error Tests ---');
    // Non-existent City (404)
    const invalidCityStopRes = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: 'non-existent-city-id', startDate: '2026-10-02', endDate: '2026-10-04', stopOrder: 1 })
    });
    if (invalidCityStopRes.status !== 404) throw new Error('Invalid city expected 404');

    // Inverted Stop Dates (400)
    const invertedStopDatesRes = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id, startDate: '2026-10-05', endDate: '2026-10-02', stopOrder: 1 })
    });
    if (invertedStopDatesRes.status !== 400) throw new Error('Inverted stop dates expected 400');

    // Stop date outside Trip date range (400)
    const outOfBoundsStopRes = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id, startDate: '2026-09-25', endDate: '2026-10-04', stopOrder: 1 })
    });
    if (outOfBoundsStopRes.status !== 400) throw new Error('Stop date outside trip range expected 400');

    // User B attempting to add stop to User A trip (404)
    const userBAddStopRes = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
      body: JSON.stringify({ cityId: city1.id, startDate: '2026-10-02', endDate: '2026-10-04', stopOrder: 1 })
    });
    if (userBAddStopRes.status !== 404) throw new Error('User B add stop expected 404');

    console.log('TripStop validation error tests passed!');

    // 20. Create TripStops (User A)
    console.log('\n--- 18. Create Valid TripStops (User A) ---');
    const stop1Res = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id, startDate: '2026-10-01', endDate: '2026-10-03', stopOrder: 1, sectionBudget: 15000 })
    });
    const stop1Data = await stop1Res.json();
    console.log('Stop 1 Created:', stop1Res.status, stop1Data.id, stop1Data.city.name);
    if (stop1Res.status !== 201 || stop1Data.city.name !== 'Jaipur' || stop1Data.sectionBudget !== 15000) {
      throw new Error('Stop 1 creation failed');
    }

    const stop2Res = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city2.id, startDate: '2026-10-04', endDate: '2026-10-07', stopOrder: 2, sectionBudget: 25000 })
    });
    const stop2Data = await stop2Res.json();

    const stop3Res = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city3.id, startDate: '2026-10-08', endDate: '2026-10-10', stopOrder: 3, sectionBudget: 20000 })
    });
    const stop3Data = await stop3Res.json();

    // 21. Get All TripStops (User A)
    console.log('\n--- 19. GET /api/trips/:tripId/stops (Ordered ASC) ---');
    const getStopsRes = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const stopsList = await getStopsRes.json();
    console.log('Stops count:', stopsList.length, stopsList.map(s => `${s.stopOrder}:${s.city.name}`));
    if (stopsList.length !== 3 || stopsList[0].stopOrder !== 1 || stopsList[1].stopOrder !== 2 || stopsList[2].stopOrder !== 3) {
      throw new Error('Get trip stops order verification failed');
    }

    // 22. Get Single TripStop (User A)
    console.log('\n--- 20. GET /api/trips/:tripId/stops/:stopId ---');
    const getSingleStopRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stop1Data.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const singleStopData = await getSingleStopRes.json();
    console.log('Single Stop Response:', getSingleStopRes.status, singleStopData.city.name);
    if (getSingleStopRes.status !== 200 || singleStopData.city.name !== 'Jaipur') {
      throw new Error('Get single trip stop failed');
    }

    // Attempting to access stop belonging to trip A via trip B route (404)
    const crossTripAccessRes = await fetch(`${baseUrl}/trips/${tripEnhancedData.id}/stops/${stop1Data.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    if (crossTripAccessRes.status !== 404) throw new Error('Cross trip stop access expected 404');

    // 23. Update TripStop (User A)
    console.log('\n--- 21. PUT /api/trips/:tripId/stops/:stopId ---');
    const updateStopRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stop1Data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ sectionBudget: 18000 })
    });
    const updatedStopData = await updateStopRes.json();
    console.log('Update Stop Response:', updateStopRes.status, updatedStopData.sectionBudget);
    if (updateStopRes.status !== 200 || updatedStopData.sectionBudget !== 18000 || updatedStopData.city.name !== 'Jaipur') {
      throw new Error('Update trip stop failed');
    }

    // 24. Reorder TripStops (3 -> 1 -> 2)
    console.log('\n--- 22. PUT /api/trips/:tripId/stops/reorder ---');
    const reorderRes = await fetch(`${baseUrl}/trips/${tripId}/stops/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ stopIds: [stop3Data.id, stop1Data.id, stop2Data.id] })
    });
    const reorderData = await reorderRes.json();
    console.log('Reorder Response:', reorderRes.status, reorderData.message);
    if (reorderRes.status !== 200) throw new Error('Reorder trip stops failed');

    const checkReorderRes = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const reorderedList = await checkReorderRes.json();
    console.log('Reordered List:', reorderedList.map(s => `${s.stopOrder}:${s.city.name}`));
    if (
      reorderedList[0].id !== stop3Data.id ||
      reorderedList[1].id !== stop1Data.id ||
      reorderedList[2].id !== stop2Data.id
    ) {
      throw new Error('Reordering verification failed');
    }

    // Reorder error tests (duplicate stop IDs, missing stop IDs, foreign stop IDs)
    const dupReorderRes = await fetch(`${baseUrl}/trips/${tripId}/stops/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ stopIds: [stop3Data.id, stop3Data.id, stop2Data.id] })
    });
    if (dupReorderRes.status !== 400) throw new Error('Duplicate reorder IDs expected 400');

    // 25. Delete Single TripStop
    console.log('\n--- 23. DELETE /api/trips/:tripId/stops/:stopId ---');
    const deleteStopRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stop3Data.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Delete Stop Response Status:', deleteStopRes.status);
    if (deleteStopRes.status !== 200) throw new Error('Delete trip stop failed');

    const verifyDeleteStopsRes = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const postDeleteStops = await verifyDeleteStopsRes.json();
    console.log('Stops count post deletion:', postDeleteStops.length);
    if (postDeleteStops.length !== 2) throw new Error('Delete trip stop count verification failed');

    // 26. GET /api/trips/:id (Verify Full Itinerary Includes Remaining Stops)
    console.log('\n--- 24. Get Trip By ID (Full Itinerary Check) ---');
    const fullTripRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const fullTripData = await fullTripRes.json();
    console.log('Full Trip Response Status:', fullTripRes.status, 'Stops count:', fullTripData.stops?.length);
    if (fullTripRes.status !== 200 || fullTripData.stops?.length !== 2) {
      throw new Error('Full trip itinerary verification failed');
    }

    // 27. Delete Trip
    console.log('\n--- 25. DELETE /api/trips/:id ---');
    const deleteRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Delete Response Status:', deleteRes.status);
    if (deleteRes.status !== 200) throw new Error('Delete trip failed!');

    // Clean up seeded Cities & test records from DB
    await prisma.city.deleteMany({ where: { id: { in: [city1.id, city2.id, city3.id] } } });
    await prisma.user.deleteMany({ where: { email: { in: [userA.email, userB.email] } } });

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
