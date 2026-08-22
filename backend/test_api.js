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

    // 4. Signup Users
    console.log('\n--- 2. Signup User A & B ---');
    const signupARes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA)
    });
    const signupAData = await signupARes.json();
    if (signupARes.status !== 201 || !signupAData.token) throw new Error('Signup A failed');
    const tokenA = signupAData.token;

    const signupBRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB)
    });
    const signupBData = await signupBRes.json();
    const tokenB = signupBData.token;

    // 5. Create Test Trips (Public & Private)
    console.log('\n--- 3. Create Public & Private Trips ---');
    // Public Trip 1 (User A)
    const pubTrip1Res = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({
        title: 'Paris Romantic Getaway',
        description: 'Exploring Eiffel Tower and Louvre Museum in Paris',
        startDate: '2026-10-01',
        endDate: '2026-10-10',
        estimatedBudget: 30000,
        status: 'UPCOMING',
        isPublic: true
      })
    });
    const pubTrip1Data = await pubTrip1Res.json();
    if (pubTrip1Res.status !== 201 || pubTrip1Data.isPublic !== true) throw new Error('Public Trip 1 creation failed');

    // Public Trip 2 (User B)
    const pubTrip2Res = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
      body: JSON.stringify({
        title: 'Tokyo Cultural Backpacking',
        description: 'Tokyo temples, food, and culture',
        startDate: '2026-11-01',
        endDate: '2026-11-12',
        estimatedBudget: 40000,
        status: 'COMPLETED',
        isPublic: true
      })
    });
    const pubTrip2Data = await pubTrip2Res.json();

    // Private Trip (User A)
    const privTripRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({
        title: 'Confidential Business Trip',
        description: 'Private meetings',
        startDate: '2026-12-01',
        endDate: '2026-12-05',
        isPublic: false
      })
    });
    const privTripData = await privTripRes.json();

    // 6. Seed Stops & Activities for Public Trip 1
    const city1 = await prisma.city.create({
      data: { name: 'Paris', country: 'France', description: 'City of Lights', imageUrl: 'https://example.com/paris.jpg' }
    });
    const stop1Res = await fetch(`${baseUrl}/trips/${pubTrip1Data.id}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id, startDate: '2026-10-01', endDate: '2026-10-05', stopOrder: 1, sectionBudget: 15000 })
    });
    const stop1Data = await stop1Res.json();

    const act1 = await prisma.activity.create({
      data: { cityId: city1.id, name: 'Eiffel Tower Night Tour', description: 'Illuminated tour', category: 'Sightseeing', estimatedCost: 150, duration: 3, effortLevel: 'LOW' }
    });

    const ta1Res = await fetch(`${baseUrl}/trips/${pubTrip1Data.id}/stops/${stop1Data.id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act1.id, date: '2026-10-02', time: '20:00', order: 1 })
    });

    // 7. PART 7: Public Trip Listing & Isolation Tests
    console.log('\n--- 4. PART 7: GET /api/community/trips (Public Trips Listing) ---');
    const commTripsRes = await fetch(`${baseUrl}/community/trips`);
    const commTripsData = await commTripsRes.json();
    console.log('Community Trips Response Status:', commTripsRes.status, 'Total:', commTripsData.pagination.total);
    if (
      commTripsRes.status !== 200 ||
      commTripsData.pagination.total !== 2 ||
      commTripsData.data.some(t => t.isPublic === false)
    ) {
      throw new Error('Public trip listing failed or exposed private trips!');
    }

    // Verify passwordHash is absent in user attribution
    if (commTripsData.data[0].user && commTripsData.data[0].user.passwordHash !== undefined) {
      throw new Error('passwordHash exposed in community listing!');
    }

    // Attempting query param ?isPublic=false (must NOT expose private trips)
    const bypassAttemptRes = await fetch(`${baseUrl}/community/trips?isPublic=false`);
    const bypassAttemptData = await bypassAttemptRes.json();
    if (bypassAttemptData.data.some(t => t.isPublic === false)) {
      throw new Error('isPublic=false query parameter bypassed private trip protection!');
    }

    // 8. PART 7: Search & Filter Tests
    console.log('\n--- 5. PART 7: Search & Status Filtering ---');
    // Search by title "Paris"
    const searchRes = await fetch(`${baseUrl}/community/trips?search=paris`);
    const searchData = await searchRes.json();
    console.log('Search "paris" result count:', searchData.pagination.total, searchData.data[0]?.title);
    if (searchData.pagination.total !== 1 || searchData.data[0].id !== pubTrip1Data.id) {
      throw new Error('Community search by title failed');
    }

    // Filter by status COMPLETED
    const statusRes = await fetch(`${baseUrl}/community/trips?status=COMPLETED`);
    const statusData = await statusRes.json();
    console.log('Status COMPLETED result count:', statusData.pagination.total, statusData.data[0]?.title);
    if (statusData.pagination.total !== 1 || statusData.data[0].id !== pubTrip2Data.id) {
      throw new Error('Community status filter failed');
    }

    // Invalid status filter (400)
    const invalidStatusRes = await fetch(`${baseUrl}/community/trips?status=INVALID_STATUS`);
    if (invalidStatusRes.status !== 400) throw new Error('Invalid status filter expected 400');

    // 9. PART 7: Pagination Tests
    console.log('\n--- 6. PART 7: Pagination Validation & Functionality ---');
    const pageRes = await fetch(`${baseUrl}/community/trips?page=1&limit=1`);
    const pageData = await pageRes.json();
    if (pageRes.status !== 200 || pageData.data.length !== 1 || pageData.pagination.totalPages !== 2) {
      throw new Error('Community pagination failed');
    }

    // Invalid page/limit (400)
    const invalidPageRes = await fetch(`${baseUrl}/community/trips?page=0`);
    if (invalidPageRes.status !== 400) throw new Error('Invalid page expected 400');

    const invalidLimitRes = await fetch(`${baseUrl}/community/trips?limit=100`);
    if (invalidLimitRes.status !== 400) throw new Error('Invalid limit expected 400');

    // 10. PART 7: Public Trip Detail
    console.log('\n--- 7. PART 7: GET /api/community/trips/:tripId (Public Trip Detail) ---');
    const detailRes = await fetch(`${baseUrl}/community/trips/${pubTrip1Data.id}`);
    const detailData = await detailRes.json();
    console.log('Public Trip Detail Response Status:', detailRes.status, detailData.title, 'Stops count:', detailData.stops.length);
    if (
      detailRes.status !== 200 ||
      detailData.title !== 'Paris Romantic Getaway' ||
      detailData.stops.length !== 1 ||
      detailData.stops[0].city.name !== 'Paris' ||
      detailData.stops[0].tripActivities[0].activity.name !== 'Eiffel Tower Night Tour'
    ) {
      throw new Error('Public trip detail retrieval failed');
    }

    // Verify numeric decimal conversions
    if (
      typeof detailData.estimatedBudget !== 'number' ||
      typeof detailData.stops[0].sectionBudget !== 'number' ||
      typeof detailData.stops[0].tripActivities[0].activity.estimatedCost !== 'number'
    ) {
      throw new Error('Public trip detail Decimal numeric conversion failed');
    }

    // 11. PART 7: Private Trip Protection (404)
    console.log('\n--- 8. PART 7: Private Trip Security Rejection ---');
    const privDetailRes = await fetch(`${baseUrl}/community/trips/${privTripData.id}`);
    console.log('Private Trip Access Attempt Status:', privDetailRes.status);
    if (privDetailRes.status !== 404) throw new Error('Private trip community detail access expected 404');

    // 12. Cleanup Test Records
    console.log('\n--- 9. Cleanup Test Records ---');
    await prisma.trip.deleteMany({ where: { id: { in: [pubTrip1Data.id, pubTrip2Data.id, privTripData.id] } } });
    await prisma.activity.delete({ where: { id: act1.id } });
    await prisma.city.delete({ where: { id: city1.id } });
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
