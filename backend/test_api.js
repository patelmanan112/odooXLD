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

    // 6. Signup User B
    console.log('\n--- 4. Signup User B ---');
    const signupBRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB)
    });
    const signupBData = await signupBRes.json();
    const tokenB = signupBData.token;

    // 7. Login User A
    console.log('\n--- 5. Login User A ---');
    const loginARes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userA.email, password: userA.password })
    });
    const loginAData = await loginARes.json();
    if (loginARes.status !== 200 || !loginAData.token) {
      throw new Error('Login A failed');
    }

    // 8. Protected Endpoint Without Token
    console.log('\n--- 6. Unauthenticated Profile Access (401) ---');
    const unauthProfileGet = await fetch(`${baseUrl}/users/me`);
    if (unauthProfileGet.status !== 401) throw new Error('Unauthenticated profile GET expected 401');

    const unauthProfilePut = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker' })
    });
    if (unauthProfilePut.status !== 401) throw new Error('Unauthenticated profile PUT expected 401');

    // 9. PART 5: Get Current User Profile (User A)
    console.log('\n--- 7. PART 5: GET /api/users/me (User A) ---');
    const profileARes = await fetch(`${baseUrl}/users/me`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const profileAData = await profileARes.json();
    console.log('Profile A Response:', profileARes.status, profileAData);
    if (
      profileARes.status !== 200 ||
      profileAData.email !== userA.email ||
      profileAData.name !== userA.name ||
      profileAData.passwordHash !== undefined
    ) {
      throw new Error('Get profile A failed or passwordHash exposed!');
    }

    // 10. PART 5: Update Current User Profile (Full & Partial Updates)
    console.log('\n--- 8. PART 5: PUT /api/users/me (Full Update) ---');
    const fullUpdateRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({
        name: 'Aryan Sabasana',
        avatarUrl: 'https://example.com/avatar.jpg',
        phone: '+919876543210',
        city: 'Ahmedabad',
        country: 'India',
        currency: '₹',
        bio: 'Full Stack Software Engineer & Traveler'
      })
    });
    const fullUpdateData = await fullUpdateRes.json();
    console.log('Full Profile Update Response:', fullUpdateRes.status, fullUpdateData);
    if (
      fullUpdateRes.status !== 200 ||
      fullUpdateData.name !== 'Aryan Sabasana' ||
      fullUpdateData.city !== 'Ahmedabad' ||
      fullUpdateData.phone !== '+919876543210' ||
      fullUpdateData.passwordHash !== undefined
    ) {
      throw new Error('Full profile update failed');
    }

    // Partial Update Check
    console.log('\n--- 9. PART 5: PUT /api/users/me (Partial Update) ---');
    const partialUpdateRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({
        city: 'Gandhinagar'
      })
    });
    const partialUpdateData = await partialUpdateRes.json();
    console.log('Partial Profile Update Response:', partialUpdateRes.status, partialUpdateData.city, partialUpdateData.name);
    if (
      partialUpdateRes.status !== 200 ||
      partialUpdateData.city !== 'Gandhinagar' ||
      partialUpdateData.name !== 'Aryan Sabasana' ||
      partialUpdateData.bio !== 'Full Stack Software Engineer & Traveler'
    ) {
      throw new Error('Partial profile update failed');
    }

    // 11. PART 5: Protected Fields & Role Security Checks
    console.log('\n--- 10. PART 5: Protected Field Security Tests ---');
    // Role update attempt (400)
    const roleAttemptRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ role: 'ADMIN' })
    });
    console.log('Role Update Attempt Response Status:', roleAttemptRes.status);
    if (roleAttemptRes.status !== 400) throw new Error('Role update attempt expected 400');

    // Email update attempt (400)
    const emailAttemptRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ email: 'hacker@example.com' })
    });
    if (emailAttemptRes.status !== 400) throw new Error('Email update attempt expected 400');

    // Password update attempt (400)
    const passAttemptRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ password: 'newpassword123' })
    });
    if (passAttemptRes.status !== 400) throw new Error('Password update attempt expected 400');

    // ID modification attempt (400)
    const idAttemptRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ userId: 'another-user-id' })
    });
    if (idAttemptRes.status !== 400) throw new Error('ID modification attempt expected 400');

    // Verify role remains USER
    const verifyRoleRes = await fetch(`${baseUrl}/users/me`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const verifyRoleData = await verifyRoleRes.json();
    if (verifyRoleData.role !== 'USER') throw new Error('Role elevation security failure!');
    console.log('Role remains strictly USER:', verifyRoleData.role);

    // 12. PART 5: Input Validation Errors
    console.log('\n--- 11. PART 5: Profile Input Validation Errors ---');
    const emptyNameRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ name: '   ' })
    });
    if (emptyNameRes.status !== 400) throw new Error('Empty name expected 400');

    const emptyCurrencyRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ currency: '   ' })
    });
    if (emptyCurrencyRes.status !== 400) throw new Error('Empty currency expected 400');

    // 13. Create Trip & Parts 1-4 Regression Tests
    console.log('\n--- 12. Regression Tests (Parts 1-4) ---');
    const createTripRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Profile Regression Trip', startDate: '2026-10-01', endDate: '2026-10-10' })
    });
    const tripData = await createTripRes.json();
    if (createTripRes.status !== 201) throw new Error('Trip creation regression failed');

    const city1 = await prisma.city.create({
      data: { name: 'Jaipur', country: 'India', description: 'Pink City', imageUrl: 'https://example.com/jaipur.jpg' }
    });

    const stop1Res = await fetch(`${baseUrl}/trips/${tripData.id}/stops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id, startDate: '2026-10-01', endDate: '2026-10-04', stopOrder: 1 })
    });
    const stop1Data = await stop1Res.json();
    if (stop1Res.status !== 201) throw new Error('Stop creation regression failed');

    const act1 = await prisma.activity.create({
      data: { cityId: city1.id, name: 'Hawa Mahal Sightseeing', description: 'Tour', category: 'Sightseeing', estimatedCost: 200, duration: 2, effortLevel: 'LOW' }
    });

    const ta1Res = await fetch(`${baseUrl}/trips/${tripData.id}/stops/${stop1Data.id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ activityId: act1.id, date: '2026-10-02', time: '09:00', order: 1 })
    });
    if (ta1Res.status !== 201) throw new Error('TripActivity creation regression failed');

    const saveRes = await fetch(`${baseUrl}/saved-destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ cityId: city1.id })
    });
    if (saveRes.status !== 201) throw new Error('Saved destination creation regression failed');

    // 14. Cleanup
    console.log('\n--- 13. Cleanup Test Records ---');
    await prisma.trip.delete({ where: { id: tripData.id } });
    await prisma.activity.delete({ where: { id: act1.id } });
    await prisma.savedDestination.deleteMany({ where: { cityId: city1.id } });
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
