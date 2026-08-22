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

    // 13. Create Trip for User A
    console.log('\n--- 11. Create Trip (User A) ---');
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
    console.log('Create Trip Response:', createTripRes.status, tripAData);
    if (createTripRes.status !== 201 || !tripAData.id) {
      throw new Error('Create trip failed');
    }
    const tripId = tripAData.id;

    // 14. List Trips (User A)
    console.log('\n--- 12. Get Trips (User A) ---');
    const getTripsARes = await fetch(`${baseUrl}/trips`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const tripsA = await getTripsARes.json();
    console.log('Get Trips A Response:', getTripsARes.status, 'Count:', tripsA.length);
    if (tripsA.length !== 1 || tripsA[0].id !== tripId) {
      throw new Error('Get trips for User A unexpected result');
    }

    // 15. List Trips (User B - should be empty)
    console.log('\n--- 13. Get Trips (User B) ---');
    const getTripsBRes = await fetch(`${baseUrl}/trips`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    const tripsB = await getTripsBRes.json();
    console.log('Get Trips B Response:', getTripsBRes.status, 'Count:', tripsB.length);
    if (tripsB.length !== 0) {
      throw new Error('User B saw trips belonging to User A!');
    }

    // Seed temporary City & Activity to test Full Itinerary Retrieval
    console.log('\n--- 14. Seeding City & Activity for Itinerary Test ---');
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

    // 16. GET /api/trips/:id (User A - Full Itinerary)
    console.log('\n--- 15. Get Trip By ID (User A - Full Itinerary) ---');
    const fullTripRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const fullTripData = await fullTripRes.json();
    console.log('Full Trip Response Status:', fullTripRes.status);
    console.log('Full Trip Title:', fullTripData.title);

    if (
      fullTripRes.status !== 200 ||
      fullTripData.stops?.length !== 1 ||
      fullTripData.stops[0].city.name !== 'Udaipur'
    ) {
      throw new Error('Full nested itinerary endpoint test failed!');
    }

    // 17. User B Access User A Trip (Ownership Isolation)
    console.log('\n--- 16. User B Access User A Trip (Ownership Isolation) ---');
    const userBAccessRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    console.log('User B Access Status:', userBAccessRes.status);
    if (userBAccessRes.status !== 404) {
      throw new Error('User B was able to access User A trip!');
    }

    // 18. Delete Trip
    console.log('\n--- 17. DELETE /api/trips/:id ---');
    const deleteRes = await fetch(`${baseUrl}/trips/${tripId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Delete Response Status:', deleteRes.status);
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
