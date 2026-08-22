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

    // 19. PART 2: TripStop Management Tests
    console.log('\n--- 17. Create TripStops (User A) ---');
    const stop1Res = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id, startDate: '2026-10-01', endDate: '2026-10-04', stopOrder: 1, sectionBudget: 15000 })
    });
    const stop1Data = await stop1Res.json();
    if (stop1Res.status !== 201 || stop1Data.city.name !== 'Jaipur') throw new Error('Stop 1 creation failed');

    const stop2Res = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city2.id, startDate: '2026-10-05', endDate: '2026-10-09', stopOrder: 2, sectionBudget: 25000 })
    });
    const stop2Data = await stop2Res.json();
    const stopId = stop1Data.id;

    // 20. Seed Activities in Catalog
    console.log('\n--- 18. Seeding Catalog Activities ---');
    const act1 = await prisma.activity.create({
      data: { cityId: city1.id, name: 'Hawa Mahal Sightseeing', description: 'Palace of Winds tour', category: 'Sightseeing', estimatedCost: 200, duration: 2, effortLevel: 'LOW' }
    });
    const act2 = await prisma.activity.create({
      data: { cityId: city1.id, name: 'Amer Fort Trek & Tour', description: 'Fort exploration', category: 'Adventure', estimatedCost: 500, duration: 4, effortLevel: 'HIGH' }
    });
    const act3 = await prisma.activity.create({
      data: { cityId: city1.id, name: 'Traditional Rajasthani Thali Dinner', description: 'Culinary experience', category: 'Food', estimatedCost: 800, duration: 2, effortLevel: 'LOW' }
    });

    // 21. PART 3: TripActivity Validation & Error Tests
    console.log('\n--- 19. PART 3: TripActivity Validation & Error Tests ---');
    // Invalid activityId (404)
    const invalidActRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: 'non-existent-act-id' })
    });
    if (invalidActRes.status !== 404) throw new Error('Invalid activity expected 404');

    // Invalid date format (400)
    const invalidDateActRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act1.id, date: 'invalid-date' })
    });
    if (invalidDateActRes.status !== 400) throw new Error('Invalid date expected 400');

    // Date outside stop date range (400)
    const outOfBoundsActRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act1.id, date: '2026-10-06' })
    });
    if (outOfBoundsActRes.status !== 400) throw new Error('Date outside stop range expected 400');

    // Invalid time format (400)
    const invalidTimeActRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act1.id, time: '25:90' })
    });
    if (invalidTimeActRes.status !== 400) throw new Error('Invalid time expected 400');

    // User B access User A stop (404)
    const userBActRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
      body: JSON.stringify({ activityId: act1.id })
    });
    if (userBActRes.status !== 404) throw new Error('User B activity assignment expected 404');

    console.log('TripActivity validation error tests passed!');

    // 22. Create Valid TripActivities (User A)
    console.log('\n--- 20. Create Valid TripActivities (User A) ---');
    const ta1Res = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act1.id, date: '2026-10-02', time: '09:00', order: 1 })
    });
    const ta1Data = await ta1Res.json();
    console.log('TA 1 Created:', ta1Res.status, ta1Data.id, ta1Data.activity.name, ta1Data.time);
    if (ta1Res.status !== 201 || ta1Data.activity.name !== 'Hawa Mahal Sightseeing' || ta1Data.time !== '09:00') {
      throw new Error('TA 1 creation failed');
    }

    const ta2Res = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act2.id, date: '2026-10-02', time: '14:00', order: 2 })
    });
    const ta2Data = await ta2Res.json();

    const ta3Res = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act3.id, date: '2026-10-03', time: '19:30', order: 3 })
    });
    const ta3Data = await ta3Res.json();

    // Duplicate activity assignment test (409 Conflict)
    const dupActRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act1.id })
    });
    if (dupActRes.status !== 409) throw new Error('Duplicate activity assignment expected 409');

    // 23. GET /api/trips/:tripId/stops/:stopId/activities (Sorted date/time/order)
    console.log('\n--- 21. GET TripStop Activities (Sorted) ---');
    const getTAsRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const tasList = await getTAsRes.json();
    console.log('TAs List Count:', tasList.length, tasList.map(t => `${t.time}:${t.activity.name}`));
    if (tasList.length !== 3 || tasList[0].activity.name !== 'Hawa Mahal Sightseeing' || tasList[1].activity.name !== 'Amer Fort Trek & Tour') {
      throw new Error('GET TripStop activities sorted verification failed');
    }

    // 24. GET Single TripActivity
    console.log('\n--- 22. GET Single TripActivity ---');
    const getSingleTARes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities/${ta1Data.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const singleTAData = await getSingleTARes.json();
    console.log('Single TA Response:', getSingleTARes.status, singleTAData.activity.name);
    if (getSingleTARes.status !== 200 || singleTAData.activity.name !== 'Hawa Mahal Sightseeing') {
      throw new Error('Get single trip activity failed');
    }

    // Cross-trip access prevention (404)
    const crossTripTAAccessRes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stop2Data.id}/activities/${ta1Data.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    if (crossTripTAAccessRes.status !== 404) throw new Error('Cross stop TA access expected 404');

    // 25. PUT /api/trips/:tripId/stops/:stopId/activities/:tripActivityId (Update TA)
    console.log('\n--- 23. Update TripActivity (Time & Order) ---');
    const updateTARes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities/${ta1Data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ time: '08:30' })
    });
    const updatedTAData = await updateTARes.json();
    console.log('Updated TA Response:', updateTARes.status, updatedTAData.time);
    if (updateTARes.status !== 200 || updatedTAData.time !== '08:30') throw new Error('Update trip activity failed');

    // 26. Reorder TripActivities (3 -> 1 -> 2)
    console.log('\n--- 24. Reorder TripActivities ---');
    const reorderTARes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityIds: [ta3Data.id, ta1Data.id, ta2Data.id] })
    });
    const reorderTAData = await reorderTARes.json();
    console.log('Reorder TA Response:', reorderTARes.status, reorderTAData.message);
    if (reorderTARes.status !== 200) throw new Error('Reorder trip activities failed');

    // 27. DELETE Single TripActivity
    console.log('\n--- 25. DELETE TripActivity ---');
    const deleteTARes = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities/${ta3Data.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Delete TA Response Status:', deleteTARes.status);
    if (deleteTARes.status !== 200) throw new Error('Delete trip activity failed');

    // Verify underlying Activity still exists in catalog
    const checkCatalogAct = await prisma.activity.findUnique({ where: { id: act3.id } });
    if (!checkCatalogAct) throw new Error('Delete TripActivity accidentally deleted underlying catalog Activity!');
    console.log('Underlying Activity preserved in catalog:', checkCatalogAct.name);

    // 28. Budget Calculation API Test
    console.log('\n--- 26. GET /api/trips/:tripId/budget ---');
    const budgetRes = await fetch(`${baseUrl}/trips/${tripId}/budget`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const budgetData = await budgetRes.json();
    console.log('Budget Response:', budgetRes.status, budgetData);
    if (budgetRes.status !== 200 || budgetData.total !== 700) throw new Error('Budget calculation failed');

    // 29. Clean up test records
    console.log('\n--- 27. Cleanup Test Records ---');
    await prisma.trip.delete({ where: { id: tripId } });
    await prisma.trip.delete({ where: { id: tripEnhancedData.id } });
    await prisma.activity.deleteMany({ where: { id: { in: [act1.id, act2.id, act3.id] } } });
    await prisma.city.deleteMany({ where: { id: { in: [city1.id, city2.id] } } });
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
