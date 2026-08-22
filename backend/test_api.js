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

    // 13. Create Basic Trip (User A)
    console.log('\n--- 11. Create Basic Trip (User A) ---');
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

    // 14. Create Enhanced Trip with all fields (User A)
    console.log('\n--- 12. Create Enhanced Trip (User A) ---');
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

    // 15. Seed Test Cities
    console.log('\n--- 13. Seeding Test Cities ---');
    const city1 = await prisma.city.create({
      data: { name: 'Jaipur', country: 'India', description: 'Pink City', imageUrl: 'https://example.com/jaipur.jpg' }
    });
    const city2 = await prisma.city.create({
      data: { name: 'Udaipur', country: 'India', description: 'City of Lakes', imageUrl: 'https://example.com/udaipur.jpg' }
    });

    // 16. PART 2: TripStop Tests
    console.log('\n--- 14. PART 2: TripStop Tests ---');
    const stop1Res = await fetch(`${baseUrl}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id, startDate: '2026-10-01', endDate: '2026-10-04', stopOrder: 1, sectionBudget: 15000 })
    });
    const stop1Data = await stop1Res.json();
    if (stop1Res.status !== 201 || stop1Data.city.name !== 'Jaipur') throw new Error('Stop 1 creation failed');
    const stopId = stop1Data.id;

    // 17. Seed Catalog Activities & PART 3: TripActivity Tests
    console.log('\n--- 15. PART 3: TripActivity Tests ---');
    const act1 = await prisma.activity.create({
      data: { cityId: city1.id, name: 'Hawa Mahal Sightseeing', description: 'Palace of Winds tour', category: 'Sightseeing', estimatedCost: 200, duration: 2, effortLevel: 'LOW' }
    });
    const ta1Res = await fetch(`${baseUrl}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act1.id, date: '2026-10-02', time: '09:00', order: 1 })
    });
    const ta1Data = await ta1Res.json();
    if (ta1Res.status !== 201 || ta1Data.activity.name !== 'Hawa Mahal Sightseeing') throw new Error('TA 1 creation failed');

    // 18. PART 4: SavedDestinations Tests
    console.log('\n--- 16. PART 4: Saved Destinations Unauthenticated Access (401) ---');
    const unauthSaveRes = await fetch(`${baseUrl}/saved-destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityId: city1.id })
    });
    if (unauthSaveRes.status !== 401) throw new Error('Unauthenticated save expected 401');

    const unauthListRes = await fetch(`${baseUrl}/saved-destinations`);
    if (unauthListRes.status !== 401) throw new Error('Unauthenticated list expected 401');

    const unauthDeleteRes = await fetch(`${baseUrl}/saved-destinations/some-id`, { method: 'DELETE' });
    if (unauthDeleteRes.status !== 401) throw new Error('Unauthenticated delete expected 401');

    console.log('\n--- 17. PART 4: Saved Destinations Validation Errors ---');
    // Non-existent City (404)
    const invalidCitySaveRes = await fetch(`${baseUrl}/saved-destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: 'non-existent-city-id' })
    });
    if (invalidCitySaveRes.status !== 404) throw new Error('Non-existent city save expected 404');

    // Missing cityId (400)
    const missingCitySaveRes = await fetch(`${baseUrl}/saved-destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({})
    });
    if (missingCitySaveRes.status !== 400) throw new Error('Missing cityId save expected 400');

    console.log('\n--- 18. PART 4: Save Valid Destination & Duplicate Handling ---');
    // User A saves City 1 (Jaipur)
    const saveA1Res = await fetch(`${baseUrl}/saved-destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id })
    });
    const saveA1Data = await saveA1Res.json();
    console.log('User A Saved City 1 Response:', saveA1Res.status, saveA1Data.city.name);
    if (saveA1Res.status !== 201 || saveA1Data.city.name !== 'Jaipur') throw new Error('Save city 1 failed');
    const savedA1Id = saveA1Data.id;

    // User A duplicate save of City 1 (409 Conflict)
    const dupSaveARes = await fetch(`${baseUrl}/saved-destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id })
    });
    console.log('Duplicate Save Response:', dupSaveARes.status);
    if (dupSaveARes.status !== 409) throw new Error('Duplicate save expected 409 Conflict');

    // User B saves City 1 (Valid - different users can save same city)
    const saveB1Res = await fetch(`${baseUrl}/saved-destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
      body: JSON.stringify({ cityId: city1.id })
    });
    const saveB1Data = await saveB1Res.json();
    console.log('User B Saved City 1 Response:', saveB1Res.status, saveB1Data.city.name);
    if (saveB1Res.status !== 201) throw new Error('User B save same city failed');

    // User B saves City 2 (Udaipur)
    const saveB2Res = await fetch(`${baseUrl}/saved-destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
      body: JSON.stringify({ cityId: city2.id })
    });
    const saveB2Data = await saveB2Res.json();
    if (saveB2Res.status !== 201) throw new Error('User B save city 2 failed');

    console.log('\n--- 19. PART 4: User Isolation & Listing Saved Destinations ---');
    // User A list saved destinations
    const listARes = await fetch(`${baseUrl}/saved-destinations`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const listAData = await listARes.json();
    console.log('User A Saved Destinations Count:', listAData.length, listAData.map(s => s.city.name));
    if (listAData.length !== 1 || listAData[0].city.name !== 'Jaipur') throw new Error('User A list isolation failed');

    // User B list saved destinations
    const listBRes = await fetch(`${baseUrl}/saved-destinations`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    const listBData = await listBRes.json();
    console.log('User B Saved Destinations Count:', listBData.length, listBData.map(s => s.city.name));
    if (listBData.length !== 2) throw new Error('User B list isolation failed');

    console.log('\n--- 20. PART 4: Single Saved Destination Retrieval & Ownership Isolation ---');
    // User A retrieves own saved destination
    const getSingleSaveARes = await fetch(`${baseUrl}/saved-destinations/${savedA1Id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const singleSaveAData = await getSingleSaveARes.json();
    if (getSingleSaveARes.status !== 200 || singleSaveAData.city.name !== 'Jaipur') throw new Error('Get single saved destination failed');

    // User B attempts to retrieve User A's saved destination (404)
    const crossUserGetRes = await fetch(`${baseUrl}/saved-destinations/${savedA1Id}`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    if (crossUserGetRes.status !== 404) throw new Error('Cross user single get expected 404');

    console.log('\n--- 21. PART 4: Check Whether City Is Saved ---');
    // User A checks City 1 (Jaipur) -> isSaved: true
    const checkA1Res = await fetch(`${baseUrl}/saved-destinations/check/${city1.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const checkA1Data = await checkA1Res.json();
    console.log('Check City 1 for User A:', checkA1Res.status, checkA1Data);
    if (checkA1Res.status !== 200 || checkA1Data.isSaved !== true) throw new Error('Check saved city 1 failed');

    // User A checks City 2 (Udaipur) -> isSaved: false
    const checkA2Res = await fetch(`${baseUrl}/saved-destinations/check/${city2.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const checkA2Data = await checkA2Res.json();
    console.log('Check City 2 for User A:', checkA2Res.status, checkA2Data);
    if (checkA2Res.status !== 200 || checkA2Data.isSaved !== false) throw new Error('Check unsaved city 2 failed');

    // Non-existent city check (404)
    const checkInvalidCityRes = await fetch(`${baseUrl}/saved-destinations/check/non-existent-city-id`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    if (checkInvalidCityRes.status !== 404) throw new Error('Check non-existent city expected 404');

    console.log('\n--- 22. PART 4: Delete Saved Destination & Preserving Catalog City ---');
    // User A deletes saved destination
    const deleteSaveARes = await fetch(`${baseUrl}/saved-destinations/${savedA1Id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Delete Saved Destination Response:', deleteSaveARes.status);
    if (deleteSaveARes.status !== 200) throw new Error('Delete saved destination failed');

    // Verify it is removed from list
    const postDeleteListARes = await fetch(`${baseUrl}/saved-destinations`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const postDeleteListA = await postDeleteListARes.json();
    if (postDeleteListA.length !== 0) throw new Error('Post delete list count expected 0');

    // Verify underlying Catalog City 1 (Jaipur) STILL EXISTS
    const checkCatalogCity = await prisma.city.findUnique({ where: { id: city1.id } });
    if (!checkCatalogCity) throw new Error('Deleting SavedDestination accidentally deleted underlying catalog City!');
    console.log('Underlying Catalog City preserved:', checkCatalogCity.name);

    // 19. Clean up test records
    console.log('\n--- 23. Cleanup Test Records ---');
    await prisma.trip.deleteMany({ where: { id: { in: [tripId, tripEnhancedData.id] } } });
    await prisma.activity.delete({ where: { id: act1.id } });
    await prisma.savedDestination.deleteMany({ where: { cityId: { in: [city1.id, city2.id] } } });
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
